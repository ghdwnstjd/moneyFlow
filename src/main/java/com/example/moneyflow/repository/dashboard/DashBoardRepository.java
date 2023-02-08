package com.example.moneyflow.repository.dashboard;

import com.example.moneyflow.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashBoardRepository extends JpaRepository<Resource, Long> {
}
