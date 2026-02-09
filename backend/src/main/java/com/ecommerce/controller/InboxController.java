package com.ecommerce.controller;

import com.ecommerce.model.InboxNotification;
import com.ecommerce.repository.InboxNotificationRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; // ✅ Import this

import java.util.List;

@RestController
@RequestMapping("/api/inbox")
// @CrossOrigin(origins = "*")
public class InboxController {

    private final InboxNotificationRepository repo;

    public InboxController(InboxNotificationRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{userId}")
    public List<InboxNotification> getInbox(@PathVariable Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteOne(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // 🧹 DELETE ALL USER NOTIFICATIONS
    @DeleteMapping("/user/{userId}")
    @Transactional // ✅ CRITICAL: This prevents the 500 error during bulk deletes
    public void deleteAll(@PathVariable Long userId) {
        repo.deleteByUserId(userId);
    }
}