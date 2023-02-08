
// 사용금액 표는 REST 방식으로 진행
let moneyFlowSave = (function(){

    // 리스트 출력
    function show(param, callback, error){
        $.ajax({
            url: "/dashboard-rest/show-list",
            type: "get",
            success: function(resourceDTO, status, xhr){
                if(callback){
                    callback(resourceDTO);
                }
                showList(resourceDTO);
            },
            error: function(xhr, status, err){
                if(error){
                    error(err);
                }
            }
        });
    }

    // 추가
    function add(flowContents, callback, error){
        $.ajax({
            url: "/dashboard-rest/content",
            type: "post",
            async: false,
            data: JSON.stringify(flowContents),
            contentType: "application/json; charset=utf-8",
            success: function(result, status, xhr){
                callback(result);
            },
            error: function(xhr, status, err){
                console.log(xhr, status, err);
                if(error){
                    error(err);
                }
            }
        });
    }

    // 수정
    function update(flowContent, callback, error){
        $.ajax({
            url: "/dashboard-rest/update-content",
            async: false,
            type: "post",
            data: JSON.stringify(flowContent),
            contentType: "application/json; charset=utf-8",
            success: function(result, status, xhr) {
                if (callback) {
                    callback(result);
                }
            },
            error: function(xhr, status, err){
                if(error){
                    error(err);
                }
            }
        });
    }

    // 삭제
    function remove(resourceId, callback, error){
        $.ajax({
            url: "/dashboard-rest/delete-content/" + resourceId,
            type: "delete",
            success: function(text){
                if(callback){
                    callback(text);
                }
            }, error: function(xhr, status, err){
                if(error){
                    error(err);
                }
            }
        });
    }
    return{show: show, add: add, update: update, remove: remove}
})();

// REST로 화면 적용
// 사용금액 표 비동기로 업데이트
let checkSearch = false;

show();

function show(){
    moneyFlowSave.show();
}


// 입력창 입력 시 추가
$(".addButton").on("click", function(){

    // 유효성 검사
    // 1. 하나라도 빈 칸이면 등록되지 못함
    if($(".firstCategory").val()=="" || $(".secondCategory").val()=="" || $(".thirdCategory").val()=="" || $(".money").val() ==""){
        alert("빈 칸 없이 입력해주세요.");
        return;
    }

    // 2. 금액은 숫자만 입력해야 함
    let isNumberCheck = /^[0-9]*$/;
    if(!isNumberCheck.test($(".money").val())){
        alert("금액은 숫자만 입력 가능합니다.");
        return;
    }

    // 가계부 내역 추가
    moneyFlowSave.add({
        flowForm : $(".flowForm").val(),
        flowDate : new Date($(".flowDate").val()),
        firstCategory : $(".firstCategory").val(),
        secondCategory : $(".secondCategory").val(),
        thirdCategory : $(".thirdCategory").val(),
        money : $(".money").val()
    }, show);

    // 작성내용 초기화(날짜와 수입/지출 내역은 초기화 안함)
    $(".firstCategory").val("");
    $(".secondCategory").val("");
    $(".thirdCategory").val("");
    $(".money").val("");
})

// 삭제 버튼
$(document).on("click", ".deleteBtn", function(){
    let resourceId = $(this).parent().parent().attr("data-id");
    if(confirm("삭제하시겠습니까?")){
        moneyFlowSave.remove(resourceId, function(){
            if(globalThis.keyword){
                search(globalThis.keyword);
            } else{
                show();
            }
        });
    }
})

// 수정 버튼
$(document).on("click", ".modifyBtn", function(){

    // 이미 입력내용이 그대로 입력창에 나와있도록 화면 이동 전 저장
    let presentForm = $(this).parent().parent().children("td").eq(1).text();
    let presentDate = $(this).parent().parent().children("td").eq(2).text();
    let presentFirstCategory = $(this).parent().parent().children("td").eq(3).text();
    let presentSecondCategory = $(this).parent().parent().children("td").eq(4).text();
    let presentThirdCategory = $(this).parent().parent().children("td").eq(5).text();
    let presentMoney = $(this).parent().parent().children("td").eq(6).text();
    presentMoney = presentMoney.replace(/,/g, ""); // 수정 시 금액에 콤마 제거(int형으로 유지 위해)

    // 수정 버튼 클릭 시 해당 내용이 적힌 칸이 input 박스 또는 datepicker로 전환
    let flowForm = `<select class="form-select flowForm" style="height:34px;font-size: 1.2rem;"><option value="수입">수입</option><option value="지출">지출</option></select>`;
    let flowDate = `<div class="input-group date modifyDate" data-date-format="yyyy-mm-dd"><input class="form-control flowDate" type="text" readonly style="cursor:pointer; background:white; font-size: 1.2rem;"/><span class="input-group-addon" style="width: 20%; background:white;"><i class="glyphicon glyphicon-calendar" style="top:2px;"></i></span></div>`;
    let firstCategory = `<input type="text" class="form-control firstCategory" placeholder="대카테고리" value="` + presentFirstCategory +  `">`;
    let secondCategory = `<input type="text" class="form-control secondCategory" placeholder="중카테고리" value="` + presentSecondCategory +  `">`;
    let thirdCategory = `<input type="text" class="form-control thirdCategory" placeholder="소카테고리" value="` + presentThirdCategory +  `">`;
    let money = `<input type="text" class="form-control money" placeholder="비용" value="` + presentMoney +  `">`;
    if(presentForm == "수입"){
        flowForm = `<select class="form-select flowForm" name="flowForm" aria-label="firstCategory" style="height:34px;font-size: 1.2rem;"><option value="수입">수입</option><option value="지출">지출</option></select>`;
    } else{
        flowForm = `<select class="form-select flowForm" name="flowForm" aria-label="firstCategory" style="height:34px;font-size: 1.2rem;"><option value="수입">수입</option><option selected value="지출">지출</option></select>`;
    }

    // 수정/삭제 버튼을 완료/취소 버튼으로 변경
    let modifyBtn = "";
    modifyBtn += `<button type="button" class="btn btn-outline-dark modifyCompleteBtn" style="height: 34px;">완료</button>`;
    modifyBtn += `<button type="button" class="btn btn-outline-dark modifyCancelBtn" style="height: 34px;">취소</button>`;

    $(this).parent().parent().children("td").eq(1).html(flowForm);
    $(this).parent().parent().children("td").eq(2).html(flowDate);
    $(this).parent().parent().children("td").eq(3).html(firstCategory);
    $(this).parent().parent().children("td").eq(4).html(secondCategory);
    $(this).parent().parent().children("td").eq(5).html(thirdCategory);
    $(this).parent().parent().children("td").eq(6).html(money);
    $(this).parent().html(modifyBtn);

    // 수정 버튼 클릭 시 날짜가 수정전 날짜로 그대로 나오도록 조정
    $(function () {
        $(".modifyDate").datepicker({
            autoclose: true,
            todayHighlight: true,
        }).datepicker('update', new Date(presentDate));
    });

    // 다른 거 수정 버튼 클릭 못하게 막기
    $(".modifyBtn").attr('disabled', true);
    $(".deleteBtn").attr('disabled', true);

})

// 수정 취소
$(document).on("click", ".modifyCancelBtn", function(){
    if(globalThis.keyword){
        search(globalThis.keyword);
    } else{
        show();
    }
})

// 수정 완료
$(document).on("click", ".modifyCompleteBtn", function(){
    moneyFlowSave.update({
        resourceId : $(".modifyCompleteBtn").parent().parent().attr("data-id"),
        flowForm : $("select[name=flowForm]").val(),
        flowDate : new Date($(".modifyDate").children("input").eq(0).val()),
        firstCategory : $(".firstCategory").eq(1).val(),
        secondCategory : $(".secondCategory").eq(1).val(),
        thirdCategory : $(".thirdCategory").eq(1).val(),
        money : $(".money").eq(1).val()
    });
    if(globalThis.keyword){
        search(globalThis.keyword);
    } else{
        show();
    }
})




// 출력 함수 - 등록, 수정, 삭제 시 비동기로 화면 처리
function showList(resourceDTO){
    // 사용 금액
    let text="";
    let number = 0;

    // 이번 달 요약
    let summaryText ="";
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let earnMoney = 0;
    let usingMoney = 0;
    let sumMoney = 0;

    // 그래프에 사용하기 위한 값
    let earnMoneyAr = [0,0,0,0,0,0,0,0,0,0,0,0];
    let usingMoneyAr = [0,0,0,0,0,0,0,0,0,0,0,0];

    resourceDTO.forEach(resource => {
        // ======== 요약 =========
        // 해당 월이 현재 월이고, 수입인 경우
        if(new Date(resource.flowDate).getFullYear() == year && new Date(resource.flowDate).getMonth()+1 == month){
            if(resource.flowForm == "수입"){
                earnMoney += resource.money;
            }
            else{
                usingMoney += resource.money;
            }
        }

        // 그래프에 사용하기 위해 전체 내역 중 올해인 내역 각 월 별 수입/지출 정리
        if(new Date(resource.flowDate).getFullYear() == year){
            // 몇 월인지 체크
            let compareMonth = new Date(resource.flowDate).getMonth();
            // 각 월별 수입 내역 배열에 추가
            if(resource.flowForm == "수입"){
                for(let i=0;i < earnMoneyAr.length-1;i++){
                    if(i==compareMonth){
                        earnMoneyAr[i] += resource.money;
                        break;
                    }
                }
            }
            
            // 각 월별 지출 내역 배열에 추가
            else{
                for(let i=0;i < usingMoneyAr.length-1;i++){
                    if(i==compareMonth){
                        usingMoneyAr[i] += resource.money;
                        break;
                    }
                }
            }
        }


        // ======== 사용 금액 =========
        number++;
        // 날짜 출력 시 시분초는 나오지 않도록 글자 수 자르기
        resource.flowDate = resource.flowDate.substring(0, 10);
        // 금액 표현 시 콤마 찍기
        resource.money = resource.money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        text += `<tr data-id="`;
        text += resource.resourceId + `">`;
        // 번호
        text += `<td>`;
        text += number;
        text += `</td>`;
        // 수입/지출
        text += `<td>`;
        text += resource.flowForm;
        text += `</td>`;
        // 날짜
        text += `<td>`;
        text += resource.flowDate;
        text += `</td>`;
        //대카테고리
        text += `<td>`;
        text += resource.firstCategory;
        text += `</td>`;
        //중카테고리
        text += `<td>`;
        text += resource.secondCategory;
        text += `</td>`;
        //소카테고리
        text += `<td>`;
        text += resource.thirdCategory;
        text += `</td>`;
        //비용
        text += `<td>`;
        text += resource.money;
        text += `</td>`;
        //수정/삭제
        text += `<td>`;
        text += `<button type="button" class="btn btn-outline-dark modifyBtn">수정</button>`;
        text += `<button type="button" class="btn btn-outline-dark deleteBtn">삭제</button>`;
        text += `</td>`;
        text += `</tr>`;
    })

    // 요약 합계 금액
    sumMoney = earnMoney - usingMoney;

    earnMoney = earnMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    usingMoney = usingMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    sumMoney = sumMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    summaryText += `<h2>이번 달 요약</h2>`;
    summaryText += `<div class="col form-floating mb-3" style="margin-top:10px;">`;
    summaryText += `<input type="text" readOnly class="form-control" id="floatingInput" value="`;
    summaryText += earnMoney + `원" `;
    summaryText += `style="height:85px; font-size:2.5rem; text-align:right; background:rgb(230 147 251 / 20%); cursor:pointer;">`;
    summaryText += `<label htmlFor="floatingInput" style="font-size:1.3rem; left: -20px;">수입</label></div>`;
    summaryText += `<div class="col form-floating mb-3">`;
    summaryText +=`<input type="text" readOnly class="form-control" id="floatingInputSecond" value="`;
    summaryText +=usingMoney + `원" `;
    summaryText +=`style="height:85px; font-size:2.5rem; text-align:right; background:rgb(109 98 167 / 20%); cursor:pointer;">`;
    summaryText +=`<label htmlFor="floatingInput" style="font-size:1.3rem; left: -20px;">지출</label></div>`;
    summaryText +=`<div class="col form-floating mb-3">`;
    summaryText +=`<input type="text" readOnly class="form-control" id="floatingInputThird" value="`;
    summaryText += sumMoney + `원" `;
    summaryText +=`style="height:85px; font-size:2.5rem; text-align:right; background:rgb(39 2 233 / 20%); cursor:pointer;">`;
    summaryText +=`<label htmlFor="floatingInput" style="font-size:1.3rem; left: -20px;">잔액</label></div>`;

    $(".summary").html(summaryText);
    $(".dataTable").html(text);


    // 요약 그래프
    let ctxL = document.getElementById("lineChart").getContext('2d');
    let myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            datasets: [{
                label: "수입",
                data: earnMoneyAr,
                backgroundColor: [
                    'rgba(105, 0, 132, .2)',
                ],
                borderColor: [
                    'rgba(200, 99, 132, .7)',
                ],
                borderWidth: 2
            },
                {
                    label: "지출",
                    data: usingMoneyAr,
                    backgroundColor: [
                        'rgba(0, 137, 132, .2)',
                    ],
                    borderColor: [
                        'rgba(0, 10, 130, .7)',
                    ],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}


// 검색 기능
globalThis.keyword = '';

// 엔터를 눌렀을 때, 페이지 초기화와 keyword, input태그의 값을 저장한다.
$(".searchKeyword").on("keyup", function(key){
    // 엔터를 눌렀을 시 , 페이지 초기화와 keyword, input태그의 값을 저장한다.
    if(key.keyCode==13){
        if($(".searchKeyword").val()){
            globalThis.keyword = $(".searchKeyword").val();
            search(globalThis.keyword);
        }
    }
});

// 검색 버튼 클릭 시
$(".searchKeywordBtn").on("click", function(key){
    // 엔터를 눌렀을 시 , 페이지 초기화와 keyword, input태그의 값을 저장한다.
    if($(".searchKeyword").val()){
        globalThis.keyword = $(".searchKeyword").val();
        search(globalThis.keyword);
    }
});

// 검색어 입력
function search(obj){
    let keyword = obj;

    //pageable의 page값은 0부터 시작한다.
    $.ajax({
        url: "/dashboard-rest/" + keyword,
        type: "get",
        success: searchFilteringList
    })
}


// 구분 필터
function searchFlowType(flowType){
    let type = flowType;
    console.log(type);

    //pageable의 page값은 0부터 시작한다.
    $.ajax({
        url: "/dashboard-rest/flow-filter/" + type,
        type: "get",
        success: searchFilteringList
    })
}

// 날짜 필터
function dateType(startDate, endDate){

    let startMonth = startDate.getMonth()+1;
    let startDay = startDate.getDate();
    let endMonth = endDate.getMonth()+1;
    let endDay = endDate.getDate();

    if(startMonth < 10){
        startMonth = "0" + startMonth;
    }

    if(startDay < 10){
        startDay = "0" + startDay;
    }

    if(endMonth < 10){
        endMonth = "0" + endMonth;
    }

    if(endDay < 10){
        endDay = "0" + endDay;
    }


    let start = startDate.getFullYear() + "-" + startMonth + "-" + startDay;
    let end = endDate.getFullYear() + "-" + endMonth + "-" + endDay;
    $.ajax({
        url: "/dashboard-rest/date-filter/" +  start + "/" + end,
        type: "get",
        success: searchFilteringList
    })
}

// 검색어 + 구분 필터
function searchKeywordAndFlowType(obj, flowType){
    let keyword = obj;
    let type = flowType;

    //pageable의 page값은 0부터 시작한다.
    $.ajax({
        url: "/dashboard-rest/search-flow/" + keyword + "/" + type,
        type: "get",
        success: searchFilteringList
    })
}

// 검색어 + 날짜 필터
function searchKeywordAndDateType(obj, startDate, endDate){
    let keyword = obj;

    let startMonth = startDate.getMonth()+1;
    let startDay = startDate.getDate();
    let endMonth = endDate.getMonth()+1;
    let endDay = endDate.getDate();

    if(startMonth < 10){
        startMonth = "0" + startMonth;
    }

    if(startDay < 10){
        startDay = "0" + startDay;
    }

    if(endMonth < 10){
        endMonth = "0" + endMonth;
    }

    if(endDay < 10){
        endDay = "0" + endDay;
    }


    let start = startDate.getFullYear() + "-" + startMonth + "-" + startDay;
    let end = endDate.getFullYear() + "-" + endMonth + "-" + endDay;

    //pageable의 page값은 0부터 시작한다.
    $.ajax({
        url: "/dashboard-rest/search-date-filter/" + keyword + "/" +  start + "/" + end,
        type: "get",
        success: searchFilteringList
    })
}

// 구분 + 날짜 필터
function flowTypeAndDateType(flowType, startDate, endDate){
    let type = flowType;

    let startMonth = startDate.getMonth()+1;
    let startDay = startDate.getDate();
    let endMonth = endDate.getMonth()+1;
    let endDay = endDate.getDate();

    if(startMonth < 10){
        startMonth = "0" + startMonth;
    }

    if(startDay < 10){
        startDay = "0" + startDay;
    }

    if(endMonth < 10){
        endMonth = "0" + endMonth;
    }

    if(endDay < 10){
        endDay = "0" + endDay;
    }


    let start = startDate.getFullYear() + "-" + startMonth + "-" + startDay;
    let end = endDate.getFullYear() + "-" + endMonth + "-" + endDay;

    //pageable의 page값은 0부터 시작한다.
    $.ajax({
        url: "/dashboard-rest/flow-date-filter/" + type + "/" +  start + "/" + end,
        type: "get",
        success: searchFilteringList
    })
}

// 검색어 + 구분 + 날짜 필터
function searchKeywordAndFlowTypeAndDateType(obj, flowType, startDate, endDate){
    let keyword = obj;
    let type = flowType;

    let startMonth = startDate.getMonth()+1;
    let startDay = startDate.getDate();
    let endMonth = endDate.getMonth()+1;
    let endDay = endDate.getDate();

    if(startMonth < 10){
        startMonth = "0" + startMonth;
    }

    if(startDay < 10){
        startDay = "0" + startDay;
    }

    if(endMonth < 10){
        endMonth = "0" + endMonth;
    }

    if(endDay < 10){
        endDay = "0" + endDay;
    }

    let start = startDate.getFullYear() + "-" + startMonth + "-" + startDay;
    let end = endDate.getFullYear() + "-" + endMonth + "-" + endDay;

    //pageable의 page값은 0부터 시작한다.
    $.ajax({
        url: "/dashboard-rest/search-flow-date-filter/" + keyword + "/" + type + "/" + start + "/" + end,
        type: "get",
        success: searchFilteringList
    })
}


// 검색 시 시작되는 필터링 함수
function searchFilteringList(resourceDTO){
    // 사용 금액
    let text="";
    let number = 0;

    // 이번 달 요약
    let summaryText ="";
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let earnMoney = 0;
    let usingMoney = 0;
    let sumMoney = 0;
    let earnYearMoney = 0;
    let usingYearMoney = 0;
    let sumYearMoney = 0;

    // 그래프에 사용하기 위한 값
    let earnMoneyAr = [0,0,0,0,0,0,0,0,0,0,0,0];
    let usingMoneyAr = [0,0,0,0,0,0,0,0,0,0,0,0];

    resourceDTO.forEach(resource => {
        // ======== 요약 =========
        // 해당 월이 현재 월이고, 수입인 경우
        if(new Date(resource.flowDate).getFullYear() == year && new Date(resource.flowDate).getMonth()+1 == month){
            if(resource.flowForm == "수입"){
                earnMoney += resource.money;
            }
            else{
                usingMoney += resource.money;
            }
        }

        // 그래프에 사용하기 위해 전체 내역 중 올해인 내역 각 월 별 수입/지출 정리
        if(new Date(resource.flowDate).getFullYear() == year){
            // 몇 월인지 체크
            let compareMonth = new Date(resource.flowDate).getMonth();
            // 각 월별 수입 내역 배열에 추가
            if(resource.flowForm == "수입"){
                for(let i=0;i < earnMoneyAr.length-1;i++){
                    if(i==compareMonth){
                        earnMoneyAr[i] += resource.money;
                        break;
                    }
                }
            }

            // 각 월별 지출 내역 배열에 추가
            else{
                for(let i=0;i < usingMoneyAr.length-1;i++){
                    if(i==compareMonth){
                        usingMoneyAr[i] += resource.money;
                        break;
                    }
                }
            }
        }


        // ======== 사용 금액 =========
        number++;
        // 날짜 출력 시 시분초는 나오지 않도록 글자 수 자르기
        resource.flowDate = resource.flowDate.substring(0, 10);
        // 금액 표현 시 콤마 찍기
        resource.money = resource.money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        text += `<tr data-id="`;
        text += resource.resourceId + `">`;
        // 번호
        text += `<td>`;
        text += number;
        text += `</td>`;
        // 수입/지출
        text += `<td>`;
        text += resource.flowForm;
        text += `</td>`;
        // 날짜
        text += `<td>`;
        text += resource.flowDate;
        text += `</td>`;
        //대카테고리
        text += `<td>`;
        text += resource.firstCategory;
        text += `</td>`;
        //중카테고리
        text += `<td>`;
        text += resource.secondCategory;
        text += `</td>`;
        //소카테고리
        text += `<td>`;
        text += resource.thirdCategory;
        text += `</td>`;
        //비용
        text += `<td>`;
        text += resource.money;
        text += `</td>`;
        //수정/삭제
        text += `<td>`;
        text += `<button type="button" class="btn btn-outline-dark modifyBtn">수정</button>`;
        text += `<button type="button" class="btn btn-outline-dark deleteBtn">삭제</button>`;
        text += `</td>`;
        text += `</tr>`;
    })


    // 연 요약
    for(let i =0; i<earnMoneyAr.length-1;i++){
        earnYearMoney += earnMoneyAr[i];
    }
    for(i=0; i<usingMoneyAr.length-1;i++){
        usingYearMoney += usingMoneyAr[i];
    }

    // 월 요약 합계 금액
    sumMoney = earnMoney - usingMoney;
    sumYearMoney = earnYearMoney - usingYearMoney;

    earnMoney = earnMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    usingMoney = usingMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    sumMoney = sumMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    earnYearMoney = earnYearMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    usingYearMoney = usingYearMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    sumYearMoney = sumYearMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    if(globalThis.keyword){
        if($("button.flowDate").text()=="올해"){
            summaryText += `<h2>`+ "올해 '" + globalThis.keyword + "'" + " " + $("button.flowtype").text() + " 요약" +`</h2>`;
        } else{
            summaryText += `<h2>`+ "이번 달 '" + globalThis.keyword + "'" + " " + $("button.flowtype").text() + " 요약" +`</h2>`;
        }
    }
    else{
        if($("button.flowDate").text()=="올해"){
            summaryText += `<h2>`+ "올해 " + $("button.flowtype").text() + " 요약" +`</h2>`;
        } else{
            summaryText += `<h2>`+ "이번 달 " + $("button.flowtype").text() + " 요약" + `</h2>`;
        }
    }
    summaryText += `<div class="col form-floating mb-3" style="margin-top:10px;">`;
    summaryText += `<input type="text" readOnly class="form-control" id="floatingInput" value="`;
    if($("button.flowDate").text()=="올해"){
        summaryText += earnYearMoney + `원" `;
    } else{
        summaryText += earnMoney + `원" `;
    }
    summaryText += `style="height:85px; font-size:2.5rem; text-align:right; background:rgb(230 147 251 / 20%); cursor:pointer;">`;
    summaryText += `<label for="floatingInput" style="font-size:1.3rem; left: -20px;">수입</label></div>`;
    summaryText += `<div class="col form-floating mb-3">`;
    summaryText +=`<input type="text" readOnly class="form-control" id="floatingInputSecond" value="`;
    if($("button.flowDate").text()=="올해"){
        summaryText += usingYearMoney + `원" `;
    } else{
        summaryText +=usingMoney + `원" `;
    }
    summaryText +=`style="height:85px; font-size:2.5rem; text-align:right; background:rgb(109 98 167 / 20%); cursor:pointer;">`;
    summaryText +=`<label for="floatingInput" style="font-size:1.3rem; left: -20px;">지출</label></div>`;
    summaryText +=`<div class="col form-floating mb-3">`;
    summaryText +=`<input type="text" readOnly class="form-control" id="floatingInputThird" value="`;
    if($("button.flowDate").text()=="올해"){
        summaryText += sumYearMoney + `원" `;
    } else{
        summaryText += sumMoney + `원" `;
    }
    summaryText +=`style="height:85px; font-size:2.5rem; text-align:right; background:rgb(39 2 233 / 20%); cursor:pointer;">`;
    summaryText +=`<label for="floatingInput" style="font-size:1.3rem; left: -20px;">잔액</label></div>`;

    $(".summary").html(summaryText);
    $(".dataTable").html(text);


    // 요약 그래프
    let ctxL = document.getElementById("lineChart").getContext('2d');
    let myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            datasets: [{
                label: "수입",
                data: earnMoneyAr,
                backgroundColor: [
                    'rgba(105, 0, 132, .2)',
                ],
                borderColor: [
                    'rgba(200, 99, 132, .7)',
                ],
                borderWidth: 2
            },
                {
                    label: "지출",
                    data: usingMoneyAr,
                    backgroundColor: [
                        'rgba(0, 137, 132, .2)',
                    ],
                    borderColor: [
                        'rgba(0, 10, 130, .7)',
                    ],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}

// 버튼 필터
let flowTypeButton = 0;
$("button.flowtype").on("click", function(){
    flowTypeButton++;
    switch(flowTypeButton % 3){
        case 0:
            $("button.flowtype").text("수입/지출");
            break;
        case 1:
            $("button.flowtype").text("수입");
            break;
        case 2:
            $("button.flowtype").text("지출");
            break;
    }
    // 검색어 있는지 유무 검사
    if(globalThis.keyword){ // 검색어가 있는 경우
        if(dateButton%3!=0){ // 날짜 필터가 있는 경우
            if($("button.flowtype").text()=="수입/지출"){ // 수입/지출 전체 보기일 경우 keyword, 날짜 검색만 진행
                searchKeywordAndDateType(globalThis.keyword, startDate, endDate);
            } else{ // 수입 또는 지출 보기일 경우 검색 키워드 + 수입 또는 지출 내역 + 날짜 필터 출력
                searchKeywordAndFlowTypeAndDateType(globalThis.keyword, $("button.flowtype").text(), startDate, endDate);
            }
        } else{ // 날짜 필터가 없는 경우
            if($("button.flowtype").text()=="수입/지출"){ // 수입/지출 전체 보기일 경우 keyword 검색만 진행
                search(globalThis.keyword);
            } else{ // 키워드 검색 + 수입/지출 검색
                searchKeywordAndFlowType(globalThis.keyword, $("button.flowtype").text());
            }
        }
    } else{ // 검색어가 없는 경우
        if($("button.flowtype").text()=="수입/지출"){ // 수입/지출 전체 보기일 경우
            if(dateButton%3!=0){ // 날짜 필터가 있는 경우
                dateType(startDate, endDate);
            } else{ // 날짜 필터가 없는 경우
                show();
            }
        } else{ // 수입/지출 필터가 있는 경우
            if(dateButton%3!=0){ // 날짜 필터가 있는 경우
                flowTypeAndDateType($("button.flowtype").text(), startDate, endDate);
            } else { // 날짜 필터가 없는 경우
                searchFlowType($("button.flowtype").text());
            }
        }
    }
})

// 날짜 입력
let dateButton=0;
let startDate="";
let endDate="";
$("button.flowDate").on("click", function(){
    dateButton++;
    let today = new Date();
    startDate = new Date(today);
    endDate = new Date(today);
    let last = new Date(today.getFullYear(), today.getMonth()+1, 0);

    switch(dateButton % 3){
        case 0:
            $("button.flowDate").text("전체 기간");
            startDate = new Date(2000, 0, 1);
            endDate = new Date(3000, 11, 31);
            break;
        case 1:
            $("button.flowDate").text("이번 달");
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
            break;
        case 2:
            $("button.flowDate").text("올해");
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
    }
    // 검색어 있음
    if(globalThis.keyword){
        if($("button.flowtype").text() != "수입/지출"){ // 수입/지출 필터 있음
            searchKeywordAndFlowTypeAndDateType(globalThis.keyword, $("button.flowtype").text(), startDate, endDate);
        } else{ // 수입/지출 필터 없음
            searchKeywordAndDateType(globalThis.keyword, startDate, endDate);
        }
    } else{ // 검색어 없음
        if($("button.flowtype").text() != "수입/지출") { // 수입/지출 필터 있음
            flowTypeAndDateType($("button.flowtype").text(), startDate, endDate);
        } else{ // 날짜 필터만 있음
            dateType(startDate, endDate);
        }
    }
})

// 필터 초기화
$("button.refresh").on("click", function(){
    location.reload();
})

// 뒤로가기 시 정보 저장 후 뒤로가기(이전 정보 띄우지 않기)
window.onpageshow = function(event) {
    if ( event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        // Back Forward Cache로 브라우저가 로딩될 경우 혹은 브라우저 뒤로가기 했을 경우
        location.reload();
    }
}


// 엑셀 등록 버튼 누르기
$(".registerExcel").on("click", function(){
    if($(".registerExcel").attr("class")=="registerExcel"){
        $(".excelRegisterForm").css("display", "block");
        $(".registerExcel").attr("class", "registerExcel open");
        $(".registerExcel").text("엑셀 등록 ▲")
    } else{
        $(".excelRegisterForm").css("display", "none");
        $(".registerExcel").attr("class", "registerExcel");
        $(".registerExcel").text("엑셀 등록 ▼");
    }
})

