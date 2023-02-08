package com.example.moneyflow.repository.dashboard;

import com.example.moneyflow.domain.ResourceDTO;

import java.util.List;

public interface DashBoardCustomRepository {

    // 화면 출력
    public List<ResourceDTO> findAll();
}
