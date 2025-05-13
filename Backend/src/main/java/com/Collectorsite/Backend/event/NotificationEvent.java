package com.Collectorsite.Backend.event;

import com.Collectorsite.Backend.entity.AppUser;
import lombok.*;

@Getter
@ToString
@AllArgsConstructor
public class NotificationEvent {
    private final AppUser recipient;
    private final String  type;
    private final Object  payload;
}
