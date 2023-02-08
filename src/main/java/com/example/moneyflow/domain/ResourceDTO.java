package com.example.moneyflow.domain;

import com.example.moneyflow.entity.Resource;
import com.querydsl.core.annotations.QueryProjection;
import com.sun.istack.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Data
@NoArgsConstructor
public class ResourceDTO {
    private Long resourceId; // PK

    private String flowForm; // 수입 or 지출

    @DateTimeFormat(pattern="yyyy-MM-dd")
    private LocalDateTime flowDate; // 날짜

    private String firstCategory; // 대카테고리

    private String secondCategory; // 중카테고리

    private String thirdCategory; // 소카테고리

    private int money; // 금액

    @QueryProjection
    public ResourceDTO(Long resourceId, String flowForm, LocalDateTime flowDate, String firstCategory, String secondCategory, String thirdCategory, int money){
        this.resourceId = resourceId;
        this.flowForm = flowForm;
        this.flowDate = flowDate;
        this.firstCategory = firstCategory;
        this.secondCategory = secondCategory;
        this.thirdCategory = thirdCategory;
        this.money = money;

    }

    public Resource toEntity(){
        return Resource.builder()
                .flowForm(flowForm)
                .flowDate(flowDate)
                .firstCategory(firstCategory)
                .secondCategory(secondCategory)
                .thirdCategory(thirdCategory)
                .money(money)
                .build();
    }

}
