package com.example.tbapi.controller;

import com.example.tbapi.dto.PageMetadata;
import com.example.tbapi.dto.PagedResponse;
import com.example.tbapi.dto.UserFilter;
import com.example.tbapi.model.User;
import com.example.tbapi.repository.UserRepository;
import com.example.tbapi.repository.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public PagedResponse<User> getUsers(UserFilter filter, Pageable pageable) {
        Page<User> page = userRepository.findAll(UserSpecification.fromFilter(filter), pageable);

        return PagedResponse.<User>builder()
                .content(page.getContent())
                .page(PageMetadata.builder()
                        .size(page.getSize())
                        .totalElements(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .number(page.getNumber())
                        .build())
                .build();
    }
}
