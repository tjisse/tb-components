package com.example.tbapi.dto;

public record AddressFilter(
    StringFilter city,
    StringFilter street
) {}
