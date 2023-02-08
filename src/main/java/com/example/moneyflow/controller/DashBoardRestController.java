package com.example.moneyflow.controller;


import com.example.moneyflow.domain.ResourceDTO;
import com.example.moneyflow.entity.Resource;
import com.example.moneyflow.repository.dashboard.DashBoardRepository;
import com.example.moneyflow.service.dashboard.DashBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard-rest/*")
public class DashBoardRestController {

    private final DashBoardService dashBoardService;
    private final DashBoardRepository dashBoardRepository;

    // 화면 출력
    @GetMapping("/show-list")
    public List<ResourceDTO> getMoneyFlow(){
        List<ResourceDTO> resourceDTO = dashBoardService.findAll();
        return resourceDTO;
    }

    
    // 가계부 작성 내역 저장
    @PostMapping(value="/content", consumes = "application/json", produces = "application/json; charset=utf-8")
    public ResourceDTO save(@RequestBody ResourceDTO resourceDTO) throws UnsupportedEncodingException {
        
        //TBL_RESOURCE 에 작성 값 저장
        ResourceDTO resource = dashBoardService.add(resourceDTO);

        return resource;
    }

    // 작성 내역 수정
    @Transactional(rollbackFor = Exception.class)
    @PostMapping(value="/update-content", consumes = "application/json", produces = "application/json; charset=utf-8")
    public ResponseEntity<String> update(@RequestBody ResourceDTO resourceDTO) throws UnsupportedEncodingException {

        Resource resource = dashBoardRepository.findById(resourceDTO.getResourceId()).get();
        resource.update(resourceDTO);

        return new ResponseEntity<>(new String("update success".getBytes(), "UTF-8"), HttpStatus.OK);
    }

    // 작성 내역 삭제
    @DeleteMapping("/delete-content/{resourceId}")
    public void remove(@PathVariable("resourceId") Long resourceId){
        dashBoardService.delete(resourceId);
    }

    // 검색어 검색
    @GetMapping("/{search}")
    public List<ResourceDTO> searchList(@PathVariable("search") String search){
        return dashBoardService.searchList(search);
    }

    // 수입/지출 필터 검색
    @GetMapping("/flow-filter/{flowType}")
    public List<ResourceDTO> typeFilterList(@PathVariable("flowType") String flowType){
        return dashBoardService.typeFilterList(flowType);
    }

    // 날짜 필터 검색
    @GetMapping("/date-filter/{start}/{end}")
    public List<ResourceDTO> dateFilterList(@PathVariable("start") String startDate, @PathVariable("end") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        startDate = startDate + " 00:00:00.000";
        endDate = endDate + " 11:59:59.000";
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        return dashBoardService.dateFilterList(start, end);
    }

    // 검색어 + 수입/지출 필터 검색
    @GetMapping("/search-flow/{search}/{flowType}")
    public List<ResourceDTO> searchAndTypeFilterList(@PathVariable("search") String search, @PathVariable("flowType") String flowType){
        return dashBoardService.searchAndTypeFilterList(search, flowType);
    }

    // 검색어 + 날짜 필터 검색
    @GetMapping("/search-date-filter/{keyword}/{start}/{end}")
    public List<ResourceDTO> searchAndTypeFilterList(@PathVariable("keyword") String search, @PathVariable("start") String startDate, @PathVariable("end") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        startDate = startDate + " 00:00:00.000";
        endDate = endDate + " 11:59:59.000";
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        return dashBoardService.searchAndDateFilterList(search, start, end);
    }

    // 수입/지출 + 날짜 필터 검색
    @GetMapping("/flow-date-filter/{flowType}/{start}/{end}")
    public List<ResourceDTO> typeFilterAndDateFilterList(@PathVariable("flowType") String flowType, @PathVariable("start") String startDate, @PathVariable("end") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        startDate = startDate + " 00:00:00.000";
        endDate = endDate + " 11:59:59.000";
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        return dashBoardService.typeFilterAndDateFilterList(flowType, start, end);
    }

    // 검색어 + 수입/지출 + 날짜 필터 검색
    @GetMapping("/search-flow-date-filter/{keyword}/{flowType}/{start}/{end}")
    public List<ResourceDTO> typeFilterAndDateFilterList(@PathVariable("keyword") String search, @PathVariable("flowType") String flowType, @PathVariable("start") String startDate, @PathVariable("end") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        startDate = startDate + " 00:00:00.000";
        endDate = endDate + " 11:59:59.000";
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        return dashBoardService.keywordAndTypeFilterAndDateFilterList(search, flowType, start, end);
    }


    // 엑셀 파일 저장
    @RequestMapping("/excel-download")
    public void download(HttpServletResponse response) throws IOException {
        dashBoardService.excelDownload(response);
    }
}
