package com.lostandfound.controller;

import com.lostandfound.model.ChatMessage;
import com.lostandfound.repository.ChatMessageRepository;
import com.lostandfound.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/{itemId}")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long itemId) {
        List<ChatMessage> messages = chatMessageRepository.findByItemIdOrderByTimestampAsc(itemId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{itemId}")
    public ResponseEntity<?> sendMessage(@PathVariable Long itemId, 
                                       @RequestBody Map<String, String> request,
                                       @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtService.extractUsername(jwt);
            
            if (!jwtService.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }

            String messageText = request.get("message");
            String messageType = request.get("messageType");
            String mediaUrl = request.get("mediaUrl");
            
            ChatMessage message;
            if ("TEXT".equals(messageType) || messageType == null) {
                if (messageText == null || messageText.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
                }
                message = new ChatMessage(itemId, username, messageText.trim());
            } else {
                message = new ChatMessage(itemId, username, messageType, mediaUrl);
                if (messageText != null && !messageText.trim().isEmpty()) {
                    message.setMessage(messageText.trim());
                }
            }
            
            chatMessageRepository.save(message);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send message"));
        }
    }
}