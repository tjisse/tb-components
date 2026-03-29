package com.example.tbapi.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PagedResponse<T> {
    private List<T> content;
    private PageMetadata page;
}
