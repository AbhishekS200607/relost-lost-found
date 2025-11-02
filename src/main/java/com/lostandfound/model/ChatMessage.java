package com.lostandfound.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private String senderUsername;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column
    private String messageType; // TEXT, IMAGE, VIDEO

    @Column
    private String mediaUrl;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public ChatMessage() {}

    public ChatMessage(Long itemId, String senderUsername, String message) {
        this.itemId = itemId;
        this.senderUsername = senderUsername;
        this.message = message;
        this.messageType = "TEXT";
        this.timestamp = LocalDateTime.now();
    }

    public ChatMessage(Long itemId, String senderUsername, String messageType, String mediaUrl) {
        this.itemId = itemId;
        this.senderUsername = senderUsername;
        this.messageType = messageType;
        this.mediaUrl = mediaUrl;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}