package com.lostandfound.repository;

import com.lostandfound.model.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<FoundItem, Long> {
}