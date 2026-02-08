package com.lostandfound.controller;

import com.lostandfound.model.LostItem;
import com.lostandfound.model.User;
import com.lostandfound.repository.LostItemRepository;
import com.lostandfound.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lost-items")
@CrossOrigin(origins = "*")
public class LostItemController {

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createLostItem(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        try {
            String username = (String) httpRequest.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            User user = userService.findByUsername(username);
            
            LostItem item = new LostItem(
                request.get("itemName"),
                request.get("category"),
                request.get("description"),
                request.get("locationLost"),
                LocalDate.parse(request.get("dateLost")),
                request.get("contactInfo"),
                request.get("photoUrl"),
                user
            );
            
            LostItem savedItem = lostItemRepository.save(item);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteLostItem(@PathVariable Long itemId, HttpServletRequest httpRequest) {
        try {
            String username = (String) httpRequest.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            LostItem item = lostItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

            if (!item.getUser().getUsername().equals(username)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own items"));
            }

            lostItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
