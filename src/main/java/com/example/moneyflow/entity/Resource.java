package com.example.moneyflow.entity;

import com.example.moneyflow.domain.ResourceDTO;
import com.sun.istack.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "TBL_RESOURCE")
@Getter
@ToString
@NoArgsConstructor
public class Resource {

    @Id
    @GeneratedValue
    private Long resourceId; // PK

    @NotNull
    private String flowForm; // 수입 or 지출

    @NotNull
    private LocalDateTime flowDate; // 날짜

    @NotNull
    private String firstCategory; // 대카테고리

    @NotNull
    private String secondCategory; // 중카테고리

    @NotNull
    private String thirdCategory; // 소카테고리

    @NotNull
    private int money; // 금액

    @Builder
    public Resource(String flowForm, LocalDateTime flowDate, String firstCategory, String secondCategory, String thirdCategory, int money){
        this.flowForm = flowForm;
        this.flowDate = flowDate;
        this.firstCategory = firstCategory;
        this.secondCategory = secondCategory;
        this.thirdCategory = thirdCategory;
        this.money = money;
    }

    public void update(ResourceDTO resourceDTO) {
        this.flowForm = resourceDTO.getFlowForm();
        this.flowDate = resourceDTO.getFlowDate();
        this.firstCategory = resourceDTO.getFirstCategory();
        this.secondCategory = resourceDTO.getSecondCategory();
        this.thirdCategory = resourceDTO.getThirdCategory();
        this.money = resourceDTO.getMoney();
    }


}
