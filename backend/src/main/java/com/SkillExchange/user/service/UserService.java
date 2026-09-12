package com.SkillExchange.user.service;

import com.SkillExchange.exception.BadRequestException;
import com.SkillExchange.user.dto.PublicUserResponse;
import com.SkillExchange.user.dto.UserSearchResponse;
import com.SkillExchange.user.model.User;
import com.SkillExchange.user.repository.UserRepository;
import com.SkillExchange.user.skill.dto.UserSkillResponse;
import com.SkillExchange.user.skill.model.UserLearningSkill;
import com.SkillExchange.user.skill.model.UserTeachingSkill;
import com.SkillExchange.user.skill.repository.UserLearningSkillRepository;
import com.SkillExchange.user.skill.repository.UserTeachingSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserTeachingSkillRepository teachingSkillRepository;

    private final UserLearningSkillRepository learningSkillRepository;


    // ==========================================
    // SEARCH USERS BY TEACHING SKILL
    // ==========================================

    @Transactional(readOnly = true)
    public List<UserSearchResponse> searchUsersByTeachingSkill(
            String skillName,
            String currentUsername
    ) {

        if (skillName == null || skillName.trim().isEmpty()) {

            throw new BadRequestException(
                    "Skill name is required"
            );
        }

        List<UserTeachingSkill> teachingSkills =
                teachingSkillRepository
                        .findBySkillNameIgnoreCase(
                                skillName.trim()
                        );

        return teachingSkills
                .stream()
                .filter(userTeachingSkill ->
                        !userTeachingSkill
                                .getUser()
                                .getUsername()
                                .equalsIgnoreCase(currentUsername)
                )
                .map(this::mapSearchResponse)
                .toList();
    }


    // ==========================================
    // PUBLIC USER PROFILE
    // ==========================================

    @Transactional(readOnly = true)
    public PublicUserResponse getPublicProfile(
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new BadRequestException(
                                "User not found"
                        )
                );

        List<UserSkillResponse> teachingSkills =
                teachingSkillRepository
                        .findByUser(user)
                        .stream()
                        .map(this::mapTeachingSkill)
                        .toList();

        List<UserSkillResponse> learningSkills =
                learningSkillRepository
                        .findByUser(user)
                        .stream()
                        .map(this::mapLearningSkill)
                        .toList();

        return PublicUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .teachingSkills(teachingSkills)
                .learningSkills(learningSkills)
                .build();
    }


    // ==========================================
    // SEARCH RESPONSE MAPPER
    // ==========================================

    private UserSearchResponse mapSearchResponse(
            UserTeachingSkill userTeachingSkill
    ) {

        User user = userTeachingSkill.getUser();

        var skill = userTeachingSkill.getSkill();

        return UserSearchResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .skillId(skill.getId())
                .skillName(skill.getName())
                .category(skill.getCategory())
                .build();
    }


    // ==========================================
    // TEACHING SKILL MAPPER
    // ==========================================

    private UserSkillResponse mapTeachingSkill(
            UserTeachingSkill userTeachingSkill
    ) {

        var skill = userTeachingSkill.getSkill();

        return UserSkillResponse.builder()
                .id(userTeachingSkill.getId())
                .skillId(skill.getId())
                .skillName(skill.getName())
                .category(skill.getCategory())
                .build();
    }


    // ==========================================
    // LEARNING SKILL MAPPER
    // ==========================================

    private UserSkillResponse mapLearningSkill(
            UserLearningSkill userLearningSkill
    ) {

        var skill = userLearningSkill.getSkill();

        return UserSkillResponse.builder()
                .id(userLearningSkill.getId())
                .skillId(skill.getId())
                .skillName(skill.getName())
                .category(skill.getCategory())
                .build();
    }
}