package com.example.tbapi.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN("Admin"),
    USER("User"),
    EDITOR("Editor"),
    GUEST("Guest");

    @JsonValue
    private final String displayValue;

    public static Role fromDisplayValue(String displayValue) {
        return Arrays.stream(Role.values())
                .filter(r -> r.getDisplayValue().equalsIgnoreCase(displayValue))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown role: " + displayValue));
    }
}
