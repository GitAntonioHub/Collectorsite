package com.Collectorsite.Backend.component;

import com.Collectorsite.Backend.repository.NotificationRepository;
import com.Collectorsite.Backend.entity.AppUser;
import com.Collectorsite.Backend.entity.Notification;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.*;

@Component
@RequiredArgsConstructor
public class Notifier {

    private final SimpMessagingTemplate ws;
    private final JavaMailSender mail;
    private final NotificationRepository repo;
    private final ObjectMapper mapper = new ObjectMapper();

    public void notify(AppUser to, String type, Object payload) {
        try {
            String json = mapper.writeValueAsString(payload);
            Notification n = repo.save(Notification.builder()
                    .user(to).type(type).payloadJson(json).build());

            // WebSocket push
            ws.convertAndSend("/topic/notif/" + to.getId(), n);

            // e‑mail (simple HTML)
            MimeMessage msg = mail.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);
            helper.setTo(to.getEmail());
            helper.setSubject("CollectorSite – " + type.replace('_', ' '));
            helper.setText("<p>You have a new notification:</p><pre>" + json + "</pre>", true);
            mail.send(msg);

        } catch (Exception e) {
            // log but don't fail business flow
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}
