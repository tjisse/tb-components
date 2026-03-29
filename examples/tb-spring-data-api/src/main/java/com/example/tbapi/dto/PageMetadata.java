package com.example.tbapi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageMetadata {
    private int size;
    private long totalElements;
    private int totalPages;
    private int number;
}
