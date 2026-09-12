package com.SkillExchange.user.controller;

import com.SkillExchange.user.dto.PublicUserResponse;
import com.SkillExchange.user.dto.UserSearchResponse;
import com.SkillExchange.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // ==========================================
    // SEARCH USERS BY TEACHING SKILL
    // ==========================================

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> searchUsers(
            @RequestParam String skill,
            Authentication authentication
    ) {

        String currentUsername =
                authentication.getName();

        return ResponseEntity.ok(
                userService.searchUsersByTeachingSkill(
                        skill,
                        currentUsername
                )
        );
    }


    // ==========================================
    // PUBLIC USER PROFILE
    // ==========================================

    @GetMapping("/{id}/public-profile")
    public ResponseEntity<PublicUserResponse> getPublicProfile(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userService.getPublicProfile(id)
        );
    }
}