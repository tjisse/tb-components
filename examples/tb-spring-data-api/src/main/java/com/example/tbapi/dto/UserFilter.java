package com.example.tbapi.dto;

public record UserFilter(
    StringFilter name,
    StringFilter email,
    StringFilter role,
    AddressFilter address
) {}
