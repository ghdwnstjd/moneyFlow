package com.example.moneyflow.service.dashboard;

import com.example.moneyflow.domain.ResourceDTO;
import com.example.moneyflow.entity.Resource;
import com.example.moneyflow.repository.dashboard.DashBoardRepository;
import com.example.moneyflow.repository.dashboard.DashBoardRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service @Qualifier("resource") @Primary
@RequiredArgsConstructor
public class DashBoardService {

    private final DashBoardRepository dashBoardRepository;
    private final DashBoardRepositoryImpl dashBoardRepositoryImpl;

    // 가계부 작성 내역 저장
    @Transactional(rollbackFor = Exception.class)
    public ResourceDTO add(ResourceDTO resourceDTO){
        Resource resource = resourceDTO.toEntity();
        Resource resourceEntity = dashBoardRepository.save(resource);

        return resourceDTO;
        // 나중에 로그인 시스템이 만들어지면 그때 DTO로 추가 진행

    }

    // 가계부 내역 화면 출력
    public List<ResourceDTO> findAll() {
        List<ResourceDTO> resourceDTO = dashBoardRepositoryImpl.findAll();
        return resourceDTO;
    }

    // 작성 내역 삭제
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long resourceId){
        dashBoardRepository.deleteById(resourceId);
    }

    // 검색 기능 추가
    @Transactional
    public List<ResourceDTO> searchList(String keyword){
        List<ResourceDTO> searchList = dashBoardRepositoryImpl.searchList(keyword);
        return searchList;
    }

    // 수입/지출 필터 기능 추가
    @Transactional
    public List<ResourceDTO> typeFilterList(String flowType){
        List<ResourceDTO> typeFilterList = dashBoardRepositoryImpl.typeFilterList(flowType);
        return typeFilterList;
    }

    // 날짜 필터
    @Transactional
    public List<ResourceDTO> dateFilterList(LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> dateFilterList = dashBoardRepositoryImpl.dateFilterList(startDate, endDate);
        return dateFilterList;
    }

    // 검색 + 수입/지출 필터 기능 추가
    @Transactional
    public List<ResourceDTO> searchAndTypeFilterList(String keyword, String flowType){
        List<ResourceDTO> searchAndTypeFilterList = dashBoardRepositoryImpl.searchAndTypeFilterList(keyword, flowType);
        return searchAndTypeFilterList;
    }

    // 검색 + 날짜 필터 기능 추가
    @Transactional
    public List<ResourceDTO> searchAndDateFilterList(String keyword, LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> searchAndDateFilterList = dashBoardRepositoryImpl.searchAndDateFilterList(keyword, startDate, endDate);
        return searchAndDateFilterList;
    }

    // 수입/지출 + 날짜 필터 기능 추가
    @Transactional
    public List<ResourceDTO> typeFilterAndDateFilterList(String flowType, LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> typeFilterAndDateFilterList = dashBoardRepositoryImpl.typeFilterListAndDateFilterList(flowType, startDate, endDate);
        return typeFilterAndDateFilterList;
    }

    // 검색 + 수입/지출 + 날짜 필터 기능 추가
    @Transactional
    public List<ResourceDTO> keywordAndTypeFilterAndDateFilterList(String keyword, String flowType, LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> keywordAndTypeFilterAndDateFilterList = dashBoardRepositoryImpl.keywordAndTypeFilterListAndDateFilterList(keyword, flowType, startDate, endDate);
        return keywordAndTypeFilterAndDateFilterList;
    }

    // 엑셀 다운로드
    @Transactional
    public void excelDownload(HttpServletResponse response) throws IOException {
        XSSFWorkbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("가계부 내역");
        int rowNum = 0;
        Cell cell = null;
        Row row = null;

        // Header
        int cellNum = 0;
        row = sheet.createRow(rowNum++);
        cell = row.createCell(cellNum++);
        cell.setCellValue("수입/지출");
        cell = row.createCell(cellNum++);
        cell.setCellValue("날짜");
        cell = row.createCell(cellNum++);
        cell.setCellValue("대카테고리");
        cell = row.createCell(cellNum++);
        cell.setCellValue("중카테고리");
        cell = row.createCell(cellNum++);
        cell.setCellValue("소카테고리");
        cell = row.createCell(cellNum++);
        cell.setCellValue("금액");

//        // Body
//        for (int i = 1; i <= 3; i++) {
//            cellNum = 0;
//            row = sheet.createRow(rowNum++);
//            cell = row.createCell(cellNum++);
//            cell.setCellValue(i);
//            cell = row.createCell(cellNum++);
//            cell.setCellValue("학생" + i);
//        }

        // Download
        response.setContentType("ms-vnd/excel");
        response.setHeader("Content-Disposition", "attachment;filename=money-flow.xlsx");
        try {
            wb.write(response.getOutputStream());
        } finally {
            wb.close();
        }
    }
}
