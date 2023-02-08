package com.example.moneyflow.controller;

import com.example.moneyflow.domain.ResourceDTO;
import com.example.moneyflow.service.dashboard.DashBoardService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.tika.Tika;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

import static com.example.moneyflow.excel.ExcelUtils.isExcel;

@Controller
@RequiredArgsConstructor
@RequestMapping("/dashboard/*")
public class DashBoardController {

    private final DashBoardService dashBoardService;
    
    // 메인 페이지
    @GetMapping("/main")
    public String main(){return "app/dashboard/dashboard";}


    // 엑셀 파일
    @PostMapping("/excel-read")
    public String readExcel(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException { // 2
        response.setContentType("text/html; charset=euc-kr");
        PrintWriter out = response.getWriter();

        Tika tika = new Tika(); // Apache Tika 사용
        String detect = tika.detect(file.getBytes()); // Tika를 사용해서 MIME 타입 얻어내기

        String extension = FilenameUtils.getExtension(file.getOriginalFilename()); // 3

        if (!isExcel(detect, extension)) {
            return "redirect:/dashboard/main";
         /*   throw new IOException("엑셀파일만 업로드 해주세요.");*/
        }

        Workbook workbook = null;

        if (extension.equals("xlsx")) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else if (extension.equals("xls")) {
            workbook = new HSSFWorkbook(file.getInputStream());
        }

        assert workbook != null;
        Sheet worksheet = workbook.getSheetAt(0);

        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);
            ResourceDTO data = new ResourceDTO();

            data.setFlowForm(row.getCell(0).getStringCellValue());
            data.setFlowDate(row.getCell(1).getLocalDateTimeCellValue());
            data.setFirstCategory(row.getCell(2).getStringCellValue());
            data.setSecondCategory(row.getCell(3).getStringCellValue());
            data.setThirdCategory(row.getCell(4).getStringCellValue());
            data.setMoney((int)row.getCell(5).getNumericCellValue());

            dashBoardService.add(data);
        }

        // POST로 form 내용을 받아왔기 때문에 redirect로 리턴하지 않으면 새로고침 시 이전에 저장된 정보가 그대로 불러와서 DB에 중복 저장된다.
        return "redirect:/dashboard/main";
    }
}