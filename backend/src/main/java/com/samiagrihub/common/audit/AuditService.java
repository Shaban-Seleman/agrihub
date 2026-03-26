package com.samiagrihub.common.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.samiagrihub.user.entity.AuditLog;
import com.samiagrihub.user.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public void log(Long actorUserId, AuditAction action, String entityType, String entityId, Object payload) {
        String summary = null;
        try {
            summary = payload == null ? null : objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException ignored) {
            summary = "{\"message\":\"serialization_failed\"}";
        }
        auditLogRepository.save(AuditLog.builder()
                .actorUserId(actorUserId)
                .action(action.name())
                .entityType(entityType)
                .entityId(entityId)
                .summary(summary)
                .build());
    }
}
