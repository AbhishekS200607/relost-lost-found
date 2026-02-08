package com.lostandfound.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "lost_items")
public class LostItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category;
    private String description;
    private String locationLost;
    private LocalDate dateLost;
    private String contactInfo;
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public LostItem() {}

    public LostItem(String itemName, String category, String description, String locationLost, 
                    LocalDate dateLost, String contactInfo, String photoUrl, User user) {
        this.itemName = itemName;
        this.category = category;
        this.description = description;
        this.locationLost = locationLost;
        this.dateLost = dateLost;
        this.contactInfo = contactInfo;
        this.photoUrl = photoUrl;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocationLost() { return locationLost; }
    public void setLocationLost(String locationLost) { this.locationLost = locationLost; }

    public LocalDate getDateLost() { return dateLost; }
    public void setDateLost(LocalDate dateLost) { this.dateLost = dateLost; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
