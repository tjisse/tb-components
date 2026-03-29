package com.example.tbapi.dto;

import java.util.List;

/**
 * A generic filter for String fields that models the operator into the type.
 * Supports eq (equal), contains (partial match), and in (set of values).
 */
public record StringFilter(
    String eq,
    String contains,
    List<String> in
) {
    public boolean isEmpty() {
        return eq == null && contains == null && (in == null || in.isEmpty());
    }
}
