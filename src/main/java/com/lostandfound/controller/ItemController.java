package com.lostandfound.controller;

import com.lostandfound.model.FoundItem;
import com.lostandfound.model.User;
import com.lostandfound.repository.ItemRepository;
import com.lostandfound.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<FoundItem> getAllItems() {
        return itemRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        try {
            String username = (String) httpRequest.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            User user = userService.findByUsername(username);
            
            FoundItem item = new FoundItem(
                request.get("category"),
                request.get("description"),
                request.get("locationFound"),
                LocalDate.parse(request.get("dateFound")),
                request.get("photoUrl"),
                user
            );
            
            FoundItem savedItem = itemRepository.save(item);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId, HttpServletRequest httpRequest) {
        try {
            String username = (String) httpRequest.getAttribute("username");
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            FoundItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

            if (!item.getUser().getUsername().equals(username)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own items"));
            }

            itemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}