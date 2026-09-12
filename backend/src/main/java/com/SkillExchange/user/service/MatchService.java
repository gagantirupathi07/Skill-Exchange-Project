package com.SkillExchange.user.service;

import com.SkillExchange.user.dto.MatchResponse;
import com.SkillExchange.user.model.User;
import com.SkillExchange.user.model.UserStatus;
import com.SkillExchange.user.repository.UserRepository;
import com.SkillExchange.user.skill.model.UserLearningSkill;
import com.SkillExchange.user.skill.model.UserTeachingSkill;
import com.SkillExchange.user.skill.repository.UserLearningSkillRepository;
import com.SkillExchange.user.skill.repository.UserTeachingSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final UserRepository userRepository;

    private final UserTeachingSkillRepository teachingSkillRepository;

    private final UserLearningSkillRepository learningSkillRepository;


    // =====================================================
    // FIND MATCHES FOR LOGGED-IN USER
    // =====================================================

    @Transactional(readOnly = true)
    public List<MatchResponse> findMatches(String username) {

        // -------------------------------------------------
        // FIND CURRENT USER
        // -------------------------------------------------

        User currentUser = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // -------------------------------------------------
        // GET MY TEACHING SKILLS
        // -------------------------------------------------

        List<UserTeachingSkill> myTeachingSkills =
                teachingSkillRepository.findByUser(currentUser);


        // -------------------------------------------------
        // GET MY LEARNING SKILLS
        // -------------------------------------------------

        List<UserLearningSkill> myLearningSkills =
                learningSkillRepository.findByUser(currentUser);


        // -------------------------------------------------
        // IF I DON'T WANT TO LEARN ANYTHING
        // THERE IS NOTHING TO MATCH
        // -------------------------------------------------

        if (myLearningSkills.isEmpty()) {
            return Collections.emptyList();
        }


        // -------------------------------------------------
        // STORE MY TEACHING SKILL NAMES
        // -------------------------------------------------

        Set<String> myTeachingSkillNames =
                myTeachingSkills.stream()
                        .map(skill ->
                                skill.getSkill()
                                        .getName()
                                        .toLowerCase()
                        )
                        .collect(Collectors.toSet());


        // -------------------------------------------------
        // STORE MY LEARNING SKILL NAMES
        // -------------------------------------------------

        Set<String> myLearningSkillNames =
                myLearningSkills.stream()
                        .map(skill ->
                                skill.getSkill()
                                        .getName()
                                        .toLowerCase()
                        )
                        .collect(Collectors.toSet());


        // -------------------------------------------------
        // FIND POSSIBLE TEACHERS
        // -------------------------------------------------

        Set<User> candidateUsers = new HashSet<>();

        for (UserLearningSkill learningSkill : myLearningSkills) {

            List<UserTeachingSkill> teachers =
                    teachingSkillRepository.findBySkillId(
                            learningSkill.getSkill().getId()
                    );


            for (UserTeachingSkill teacher : teachers) {

                User candidate = teacher.getUser();


                // -------------------------------------------------
                // DON'T MATCH WITH YOURSELF
                // -------------------------------------------------

                if (candidate.getId()
                        .equals(currentUser.getId())) {

                    continue;
                }


                // -------------------------------------------------
                // ONLY ACTIVE USERS
                // -------------------------------------------------

                if (candidate.getStatus() != UserStatus.ACTIVE) {

                    continue;
                }


                candidateUsers.add(candidate);
            }
        }


        // -------------------------------------------------
        // CALCULATE MATCHES
        // -------------------------------------------------

        List<MatchResponse> matches = new ArrayList<>();


        for (User candidate : candidateUsers) {

            // -------------------------------------------------
            // GET CANDIDATE TEACHING SKILLS
            // -------------------------------------------------

            List<UserTeachingSkill> candidateTeachingSkills =
                    teachingSkillRepository.findByUser(candidate);


            // -------------------------------------------------
            // GET CANDIDATE LEARNING SKILLS
            // -------------------------------------------------

            List<UserLearningSkill> candidateLearningSkills =
                    learningSkillRepository.findByUser(candidate);


            // -------------------------------------------------
            // WHAT CAN THEY TEACH ME?
            // -------------------------------------------------

            List<String> skillsTheyCanTeach =
                    candidateTeachingSkills.stream()
                            .map(skill ->
                                    skill.getSkill().getName()
                            )
                            .filter(skillName ->
                                    myLearningSkillNames.contains(
                                            skillName.toLowerCase()
                                    )
                            )
                            .distinct()
                            .toList();


            // -------------------------------------------------
            // WHAT CAN I TEACH THEM?
            // -------------------------------------------------

            List<String> skillsTheyWantToLearn =
                    candidateLearningSkills.stream()
                            .map(skill ->
                                    skill.getSkill().getName()
                            )
                            .filter(skillName ->
                                    myTeachingSkillNames.contains(
                                            skillName.toLowerCase()
                                    )
                            )
                            .distinct()
                            .toList();


            // -------------------------------------------------
            // CALCULATE MY LEARNING MATCH
            // -------------------------------------------------

            double myLearningMatch =
                    myLearningSkillNames.isEmpty()
                            ? 0
                            : (double) skillsTheyCanTeach.size()
                              / myLearningSkillNames.size();


            // -------------------------------------------------
            // CALCULATE MY TEACHING MATCH
            // -------------------------------------------------

            double myTeachingMatch =
                    myTeachingSkillNames.isEmpty()
                            ? 0
                            : (double) skillsTheyWantToLearn.size()
                              / myTeachingSkillNames.size();


            // -------------------------------------------------
            // FINAL SCORE
            //
            // 50% = WHAT THEY CAN TEACH ME
            // 50% = WHAT THEY WANT TO LEARN FROM ME
            // -------------------------------------------------

            int matchScore = (int) Math.round(
                    (myLearningMatch * 50)
                            +
                            (myTeachingMatch * 50)
            );


            // -------------------------------------------------
            // TWO-WAY MATCH
            // -------------------------------------------------

            boolean twoWayMatch =
                    !skillsTheyCanTeach.isEmpty()
                            &&
                            !skillsTheyWantToLearn.isEmpty();


            // -------------------------------------------------
            // ONLY RETURN REAL MATCHES
            // -------------------------------------------------

            if (matchScore > 0) {

                MatchResponse response =
                        MatchResponse.builder()
                                .userId(candidate.getId())
                                .username(candidate.getUsername())
                                .firstName(candidate.getFirstName())
                                .lastName(candidate.getLastName())
                                .bio(candidate.getBio())
                                .matchScore(matchScore)
                                .twoWayMatch(twoWayMatch)
                                .skillsTheyCanTeach(
                                        skillsTheyCanTeach
                                )
                                .skillsTheyWantToLearn(
                                        skillsTheyWantToLearn
                                )
                                .build();

                matches.add(response);
            }
        }


        // -------------------------------------------------
        // BEST MATCHES FIRST
        // -------------------------------------------------

        matches.sort(
                Comparator.comparingInt(
                        MatchResponse::getMatchScore
                ).reversed()
        );


        return matches;
    }
}