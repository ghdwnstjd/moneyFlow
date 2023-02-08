package com.example.moneyflow.repository.dashboard;


import com.example.moneyflow.domain.QResourceDTO;
import com.example.moneyflow.domain.ResourceDTO;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import static com.example.moneyflow.entity.QResource.resource;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DashBoardRepositoryImpl implements DashBoardCustomRepository {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    @Override
    public List<ResourceDTO> findAll(){
        List<ResourceDTO> resources = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .orderBy(resource.flowDate.desc())
                .fetch();

        return resources;
    }

    // 검색 기능
    public List<ResourceDTO> searchList(String keyword){
        List<ResourceDTO> searchList = jpaQueryFactory.select(new QResourceDTO(
                resource.resourceId,
                resource.flowForm,
                resource.flowDate,
                resource.firstCategory,
                resource.secondCategory,
                resource.thirdCategory,
                resource.money
        ))
                .from(resource)
                .where(resource.firstCategory.like("%"+keyword+"%")
                        .or(resource.secondCategory.like("%"+keyword+"%"))
                        .or(resource.thirdCategory.like("%"+keyword+"%")))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return searchList;
    }

    // 수입/지출 타입 필터 기능
    public List<ResourceDTO> typeFilterList(String flowType){
        List<ResourceDTO> flowTypeList = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .where(resource.flowForm.like(flowType))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return flowTypeList;
    }


    // 날짜 필터 기능
    public List<ResourceDTO> dateFilterList(LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> flowTypeList = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .where(resource.flowDate.between(startDate, endDate))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return flowTypeList;
    }

    // 검색 + 수입/지출 타입 필터 기능
    public List<ResourceDTO> searchAndTypeFilterList(String keyword, String flowType){
        List<ResourceDTO> searchAndTypeFilterList = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .where(resource.flowForm.like(flowType))
                .where(resource.firstCategory.like("%"+keyword+"%")
                        .or(resource.secondCategory.like("%"+keyword+"%"))
                        .or(resource.thirdCategory.like("%"+keyword+"%")))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return searchAndTypeFilterList;
    }

    // 검색어 + 날짜 필터 기능
    public List<ResourceDTO> searchAndDateFilterList(String keyword, LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> searchAndDateFilterList = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .where(resource.flowDate.between(startDate, endDate))
                .where(resource.firstCategory.like("%"+keyword+"%")
                        .or(resource.secondCategory.like("%"+keyword+"%"))
                        .or(resource.thirdCategory.like("%"+keyword+"%")))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return searchAndDateFilterList;
    }

    // 수입/지출 + 날짜 필터 기능
    public List<ResourceDTO> typeFilterListAndDateFilterList(String flowType, LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> typeAndDateFilterList = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .where(resource.flowForm.like(flowType))
                .where(resource.flowDate.between(startDate, endDate))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return typeAndDateFilterList;
    }

    // 검색어 + 수입/지출 + 날짜 필터 기능
    public List<ResourceDTO> keywordAndTypeFilterListAndDateFilterList(String keyword, String flowType, LocalDateTime startDate, LocalDateTime endDate){
        List<ResourceDTO> keywordAndTypeFilterAndDateFilterList = jpaQueryFactory.select(new QResourceDTO(
                        resource.resourceId,
                        resource.flowForm,
                        resource.flowDate,
                        resource.firstCategory,
                        resource.secondCategory,
                        resource.thirdCategory,
                        resource.money
                ))
                .from(resource)
                .where(resource.flowForm.like(flowType))
                .where(resource.flowDate.between(startDate, endDate))
                .where(resource.firstCategory.like("%"+keyword+"%")
                        .or(resource.secondCategory.like("%"+keyword+"%"))
                        .or(resource.thirdCategory.like("%"+keyword+"%")))
                .orderBy(resource.resourceId.desc())
                .fetch();

        return keywordAndTypeFilterAndDateFilterList;
    }

}
