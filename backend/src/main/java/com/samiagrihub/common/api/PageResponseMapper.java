package com.samiagrihub.common.api;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class PageResponseMapper {

    public <T> PageResponse<T> toPageResponse(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );
    }
}
