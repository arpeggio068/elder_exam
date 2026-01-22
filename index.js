//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------//   
  function loadingStart(){
      document.getElementById("loading").classList.remove("invisible");
  }
       
  function loadingEnd(){
      document.getElementById("loading").classList.add("invisible");
  }

  function showSpin3(){
    document.getElementById('resp-spinner1').classList.remove("d-none");
    document.getElementById('resp-spinner2').classList.remove("d-none");
    document.getElementById('resp-spinner3').classList.remove("d-none");
  }

  function hideSpin3(){
    document.getElementById('resp-spinner1').classList.add("d-none");
    document.getElementById('resp-spinner2').classList.add("d-none");
    document.getElementById('resp-spinner3').classList.add("d-none");
  } 

  function showSpin5(){
    document.getElementById('resp-spinner5').classList.remove("d-none");
    document.getElementById('resp-spinner6').classList.remove("d-none");
    document.getElementById('resp-spinner7').classList.remove("d-none");
  }

  function hideSpin5(){
    document.getElementById('resp-spinner5').classList.add("d-none");
    document.getElementById('resp-spinner6').classList.add("d-none");
    document.getElementById('resp-spinner7').classList.add("d-none");
  }
//-------     Waiting/Loading Function                                 -------------// 
//----------------------------------------------------------------------------------// 




//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 
  function trim_text(el) {
    el.value = el.value.
    replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
    replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space
    replace(/\n +/, "\n"); // Removes spaces after newlines
    return;
  }

  function letGoTrim(){
    $(function(){
      $("textarea").change(function(){
        trim_text(this);
      });

      $("input").change(function(){
        trim_text(this);
      });
    });
  }

  function activeTabChange(e){
        let navLinkS= document.querySelectorAll(".main-nav .nav-link");
        navLinkS.forEach(function(linkEl){
          linkEl.classList.remove("active");        
        });
        e.target.classList.add("active");
  }       
      
  function navClickEventHandler(e){
      
         if(e.target.matches(".nav-link")){
           activeTabChange(e);               
         }      
  }
//-------     Utility Function                                         -------------// 
//----------------------------------------------------------------------------------// 




//---------------- navbar function ----------------------------------------------------------------//
//---------------- navbar function ----------------------------------------------------------------//
  async function clearElderData() {
    if (confirm("ระบบจะล้างข้อมูลนักเรียนในหน่วยความจำ\nยกเว้นข้อมูลที่รออัพโหลด!")) {
      try {
        await store.removeItem("elder_data");
        console.log("Main Elder Data removed successfully");
        // ล้าง UI
        $('#cup').html('')
        $('#vhid').html('')     
        $('#table_app').html('')
      } catch (error) {
        console.warn("error on remove Main elder data: ", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถล้างข้อมูลได้ กรุณาลองใหม่',
        });
      }
    }
  }


  function loadAlert(){
    let txt;
    if (confirm("กด ตกลง เพื่อยืนยันการดาวน์โหลดข้อมูล!")) {
      txt = "OK!";
      loadingStart();
      elderLoad()
    } else {
      txt = "Cancel!";
    }
    //document.getElementById("demo").innerHTML = txt;
  }

  async function upLoad() {    
    try {
      const all = await store.getItem("all_rec_elder");
      console.log("all_rec_elder retrieved successfully");

      const obj = all ? JSON.parse(all) : null;

      if (!obj) {
        alert("ไม่มีข้อมูลให้อัพโหลด");
        return;
      }

      if (confirm("กด ตกลง เพื่อยืนยันการอัพโหลดข้อมูล!")) {
        loadingStart();
        await saveRecord(obj);
      }
    } catch (error) {
      console.error("Error while retrieving or parsing all_rec_elder:", error);
      alert("เกิดข้อผิดพลาดระหว่างโหลดข้อมูลจากอุปกรณ์\nกรุณาลองใหม่");
      
    }
    finally {
      loadingEnd()           
      console.log('end load');
    }

  } 

//---------------- navbar function ----------------------------------------------------------------//
//---------------- navbar function ----------------------------------------------------------------//




//---------------- list table function ------------------------------------------------------------//
//---------------- list table function ------------------------------------------------------------//

  let list_filter = []

  async function listElderly2(){
     document.getElementById("showBtn").disabled = true;  
     const cup = document.getElementById("cup").value;
        
     arrayOfValues.sort((a, b) => {
        const aStartsWithTemp = a.id.startsWith("tempId");
        const bStartsWithTemp = b.id.startsWith("tempId");

        if (aStartsWithTemp && !bStartsWithTemp) {
          return -1; // a มาก่อน
        } else if (!aStartsWithTemp && bStartsWithTemp) {
          return 1; // b มาก่อน
        } else {
          // ถ้าทั้งคู่เหมือนกัน (ทั้งคู่ขึ้นต้นด้วย tempId หรือไม่เลย)
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        }
     });

     if(cup !== 'select_all'){
       list_filter = arrayOfValues.filter(r=> r['cup'] === cup).slice(0, 20)       
     }
     else{
       list_filter = arrayOfValues.slice(0, 20)     
    }

    let searchResultBox = document.getElementById("searchResults");
    let templateBox = document.getElementById("rowTemplate");
    let template = templateBox.content;

    searchResultBox.innerHTML = "";

    list_filter.forEach(r => {
      let tr = template.cloneNode(true);
      let trElement = tr.querySelector("tr");
      let cidColumn = tr.querySelector(".cid");
      let nameColumn = tr.querySelector(".fullname");
      let editButton = tr.querySelector(".edit-button");

      editButton.dataset.id = r['id'];
      trElement.setAttribute("id", "ROWNUMBER:" + r['id']);
      cidColumn.textContent = r['cid'];
      nameColumn.textContent = r['fullname'];
      
      if (r['inspector'] !== "") {
        //trElement.style.color = "#3bf405";
        cidColumn.style.color = "#3bf405";
        nameColumn.style.color = "#3bf405";
        editButton.style.color = "#3bf405";
      }
      searchResultBox.appendChild(tr);
    });
    $('#showLength').html('แสดงตัวอย่างเฉพาะ 20 รายการแรก')
    document.getElementById("showBtn").disabled = false;   
    
  }  
  
  async function setTable(){         
     await listElderly2()      
  }

//---------------- list table function ------------------------------------------------------------//
//---------------- list table function ------------------------------------------------------------//



  
//--------------   server api and store expired  -----------------------------------------------------------------------------------------
//--------------   server api and store expired  -----------------------------------------------------------------------------------------

  let arrayOfValues =[];
  let all_rec_elder = [];
  let searchAllHtml = '';
  var store = localforage.createInstance({
    name: "myDatabaseElderly11454"
  });   

  const mainUrl = 'https://script.google.com/macros/s/AKfycbzjDeMvJSWhVnhbq8juHcl3oa-m08Lut1zcqcTrmS6bH22LZi5bPz_d-196tYckGxP-/exec' 
  
  async function saveRecord(obj){  
        const obj_json = JSON.stringify({obj:obj,id:gId})        
        let formData = new FormData();
        formData.append('action', 'saveRecord');            
        formData.append('data', obj_json);

        try {
            const response = await fetch(mainUrl, {
                method: 'POST',
                redirect: "follow",
                mode: 'cors',
                body: formData,
            });
            const data = await response.json();
            console.log(data.message)

            if (data.status === "success") {
                await store.removeItem("all_rec_elder").then(function() {
                      console.log("Data removed successfully");
                    }).catch(function(error) {
                      console.log("Error while removing data: " + error);
                    });
                $('#val_total').text("  0");
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: 'อัพโหลดข้อมูลสำเร็จ!',
                    showConfirmButton: true,
                    timer: 3000
                });              

            }
            else{
              await store.removeItem("elder_data")
              Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
                showConfirmButton: true
              });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'เกิดข้อผิดพลาด โปรดตรวจสอบการเชื่อมต่ออินเตอร์เนต',
                showConfirmButton: true,
                timer: 5000
            });
        } finally {
           loadingEnd()           
           console.log('end load');
        }
  }

  async function elderLoad() {       
        const obj_json = JSON.stringify({id:gId})
        //console.log("gId: ",gId)
        let formData = new FormData();
        formData.append('action', 'elderLoad');       
        formData.append('data', obj_json);

        try {
            const response = await fetch(mainUrl, {
                method: 'POST',
                redirect: "follow",
                mode: 'cors',
                body: formData,
            });
            const data = await response.json();
            console.log(data.message)

            if (data.status === "success") {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    text: 'โหลดข้อมูลสำเร็จ!',
                    showConfirmButton: true,
                    timer: 3000
                });
                
                const arrayofArrays = data.elder //json data
                //console.log(arrayofArrays)
                await afterDropdownArrayReturned(arrayofArrays)                
                console.log("save elder data")        

            }
            else{
              await store.removeItem("elder_data")
              Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
                showConfirmButton: true
              });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'เกิดข้อผิดพลาด โปรดตรวจสอบการเชื่อมต่ออินเตอร์เนต',
                showConfirmButton: true,
                timer: 5000
            });
        } finally {
           loadingEnd()           
           console.log('end load');
        }
  }  

  async function offlineArrayReturned() {
    try {
      const check = await checkExpired("elder_data")
      if(check){
        await store.removeItem("elder_data")
        Swal.fire({
                position: 'center',
                icon: 'warning',
                text: 'ข้อมูลหมดอายุ กรุณาโหลดใหม่',
                showConfirmButton: true,
                //timer: 5000
            });
        return;
      }
      
      const lData = await store.getItem("elder_data");
      console.log("Offline Data retrieved successfully");
      
      const init = lData ? JSON.parse(lData.arrayofArrays) : [];

      const school = document.getElementById("school");

      if (Array.isArray(init) && init.length > 0) {
        arrayOfValues = init.filter(() => true);  // or keep original filter logic
        addUniqueOptionsToDropdownList(school, arrayOfValues, 'school');
        //afterFirstDropdownChanged();
        //afterSecondDropdownChanged();
      }

    } catch (error) {
      console.log("Error while retrieving offline data: " + error);
    } finally {
      //loadingEnd();
      console.log("end off line data loaded") 
    }
  }


  async function afterDropdownArrayReturned(arrayofArrays) {
    try {
      // Save data
      const obj_offline = {
        arrayofArrays:arrayofArrays, // arrayofArrays is json string
        timestamp: Date.now()

      }
      await store.setItem("elder_data", obj_offline);
      console.log("Loaded Data saved successfully");

      // Retrieve data
      const lData = await store.getItem("elder_data");
      console.log("Elder Data retrieved successfully");

      // Parse and use data
      arrayOfValues = JSON.parse(lData.arrayofArrays).filter(function(r){return true;});
      const cup = document.getElementById("cup");

      if (arrayOfValues) {
        addUniqueOptionsToDropdownList(cup, arrayOfValues, 'cup');
        //afterFirstDropdownChanged();
        //afterSecondDropdownChanged();
      }

      // Success message
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: "ดาวน์โหลดสำเร็จ",
        timer: 2000
      });

      $('#table_app').html('');
    } catch (error) {
      console.error("Error in afterDropdownArrayReturned:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลได้',
      });
    } finally {
      loadingEnd();
    }
  }

  async function checkExpired(item_name) {
    try {
      const lUserData = await store.getItem(item_name);
      const init = lUserData || null;
      const now = Date.now();
      const numDays = 12 * 60 * 60 * 1000; // 12 hours
      // const numDays = 1 * 24 * 60 * 60 * 1000; // 1 day
      // const numDays = 5 * 60 * 1000; // 5 min

      if (!init || !init.timestamp || (now - init.timestamp > numDays)) {
        $('#school').html('');
        $('#class_').html('');
        $('#room').html('');
        $('#table_app').html('');
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn("error on checkExpired function:", err);
      // ล้าง UI เผื่อข้อมูลผิดพลาดจริง
      $('#school').html('');
      $('#class_').html('');
      $('#room').html('');
      $('#table_app').html('');
      return true; // ให้ถือว่า expired ไปเลยเพื่อความปลอดภัย
    }
  }

  function addUniqueOptionsToDropdownList(el,arrayofArrays,obj){    
    let currentlyAdded = [];
    el.innerHTML = '';
    arrayofArrays.forEach(function(r){
      if(currentlyAdded.indexOf(r[obj])=== -1){
        let option = document.createElement("option"); 
        option.textContent = r[obj];
        el.appendChild(option);
        currentlyAdded.push(r[obj]);
       }
     }); 
     
     let selectAllOption = document.createElement("option");
     selectAllOption.value = "select_all";
     selectAllOption.textContent = "เลือกทั้งหมด";
     el.appendChild(selectAllOption); 
  }

  async function callOffLineData(){
    try{
        await offlineArrayReturned();        
        const all = await store.getItem("all_rec_elder");
        console.log("all_rec_elder retrieved successfully");
       
        all_rec_elder = [];
        if (all) {
          try {
            const parsed = JSON.parse(all);
            if (Array.isArray(parsed)) {
              all_rec_elder = parsed;
            } else {
              console.warn("all_rec_elder is not an array");
            }
          } catch (e) {
            console.warn("Invalid JSON in all_rec_elder:", e);
          }
        }
        // แสดงผลจำนวน
        $('#val_total').text(" " + all_rec_elder.length)
      }
      catch (error){
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'เกิดข้อผิดพลาดในการเรียกข้อมูล off line โปรดลองใหม่อีกครั้ง',
          showConfirmButton: true
        });
        console.error("Fetch Error:", error.message);
      }
      finally {
       loadingEnd(); 
      }
  }

  async function getDataAPI(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        // headers: { 'Content-Type': 'application/json' } // ไม่จำเป็นสำหรับ GET ถ้าไม่มี body
      });

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        gData = data.data;
        gId = gData[0];
        console.log("Token OK:", gId);
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'ลิงก์ web ถูกต้อง',
          showConfirmButton: true,
          timer: 3000
        });

        await callOffLineData()
        
      } else {
        gId = ''
        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'ลิงก์หมดอายุหรือไม่ถูกต้อง',
          showConfirmButton: true
        });

        console.warn('Token not found or expired');
        await store.removeItem('elder_data');

        // ถ้าต้องการ redirect
        // setTimeout(() => window.location.href = "/", 5000);
      }
    } catch (error) {
      // ดักจับ error fetch หรือ JSON parse
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true
      });
      console.error("Fetch Error:", error.message);
    } finally {
      loadingEnd(); 
    }
  }

//--------------  server api and store expired -----------------------------------------------------------------------------------------
//--------------  server api and store expired -----------------------------------------------------------------------------------------





//-------------------------------- start new search ---------------------------------------------------------------------------------------------//
  function beforeSearch(){
    const searchResultBox = document.getElementById("searchResults");
    const clearBtn = document.getElementById("clearBtn");
    const input = document.getElementById("searchInput")
    searchResultBox.innerHTML = "";
    const ok = input.value.trim().length > 3 ? true : false    
    if(ok){
      search()
    }
    else{
      $('#showLength').html('')
    }

    if (input.value.trim().length > 0) {
      clearBtn.style.display = "block";
    } else {
      clearBtn.style.display = "none";
    }
  }

  function clearSearchInput() {
    const input = document.getElementById("searchInput");
    input.value = "";
    document.getElementById("clearBtn").style.display = "none";
    input.focus();
    beforeSearch(); // เรียกใหม่เพื่อรีเซ็ตผลลัพธ์การค้นหา ถ้าต้องการ
  }

  function search() {
    const searchInput = document.getElementById("searchInput").value.toString().toLowerCase().trim();
    const searchWords = searchInput.split(/\s+/);
    const searchColumns = ['cid', 'fullname'];  // เปลี่ยนจาก index เป็นชื่อ key
    const cup = $('#cup').val()
    let fil_arr = arrayOfValues
    if(cup !== "select_all"){
      fil_arr = arrayOfValues.filter(r=> r['cup'] === cup)
    }
    const resultsArray = searchInput === "" ? [] : fil_arr.filter(r => {
      return searchWords.every(word => {
        return searchColumns.some(key => {
          return r[key]?.toString().toLowerCase().includes(word);
        });
      });
    });

    let searchResultBox = document.getElementById("searchResults");
    let templateBox = document.getElementById("rowTemplate");
    let template = templateBox.content;

    searchResultBox.innerHTML = "";

    resultsArray.forEach(r => {
      let tr = template.cloneNode(true);
      let trElement = tr.querySelector("tr");
      let cidColumn = tr.querySelector(".cid");
      let nameColumn = tr.querySelector(".fullname");
      let editButton = tr.querySelector(".edit-button");

      editButton.dataset.id = r['id'];
      cidColumn.textContent = r['cid'];
      nameColumn.textContent = r['fullname'];
      trElement.setAttribute("id", "ROWNUMBER:" + r['id']);
      if (r['inspector'] !== "") {
        //trElement.style.color = "#3bf405";
        cidColumn.style.color = "#3bf405";
        nameColumn.style.color = "#3bf405";
        editButton.style.color = "#3bf405";
      }
      searchResultBox.appendChild(tr);
    });
    $('#showLength').html('พบข้อมูล '+ resultsArray.length + " รายการ")
  }
  

  function chElPropperty(e){
    const current = e.target.dataset.toggle;
    const searchInput = document.getElementById("searchInput")
    if(current === "text"){
      e.target.innerHTML = "ค้นจากตัวเลข";
      e.target.classList.remove("btn-primary")
      e.target.classList.add("btn-success")
      e.target.dataset.toggle = "number";
      searchInput.type = "number";
    } else {
      e.target.innerHTML = "ค้นจากข้อความ";      
      e.target.classList.remove("btn-success")
      e.target.classList.add("btn-primary")
      e.target.dataset.toggle = "text";
      searchInput.type = "text";
    }
  }
  

  function clickEventHandler(e){
    if(e.target.matches(".edit-button")){
         const id = e.target.dataset.id
         setRec2(id)
         console.log("id: ",id)     
    }

    if(e.target.matches("#search_cnum")){
        chElPropperty(e)  
    }
  }

//-------------------------------- end new search -----------------------------------------------------------------------------------------------//





//=============================================================================================================
//===========================     detail.js   =================================================================
//=============================================================================================================
  function setRec2(id){ 
    const fields_need_pfilling = document.querySelectorAll('input[name="need_pfilling"]');
    Array.prototype.forEach.call(fields_need_pfilling,function(el){               
            el.checked = false;            
    }); 
    removeValidate()

    //const id = document.getElementById("inputId"+row_number).value    
    const rec = arrayOfValues.find(r=> r['id'] === id) 
    //console.log(rec['pextract'],"pextract")
    $('#id_main').val(rec['id']) 
    $('#form_cup').val(rec['cup'])
    $('#form_vhid').val(rec['vhid'])   
    $('#name').val(rec['name'])
    $('#lname').val(rec['lname'])
    $('#cid').val(rec['cid'])
    $('#sex').val(rec['sex'])
    $('#age').val(rec['age']) 
    $('#pteeth').val(rec['pteeth'])
    $('#pcaries').val(rec['pcaries'])
    $('#need_pextract').val(rec['need_pextract'])    
    setPextract()     
    $('#pfilling').val(rec['pfilling'])
    $('#permanent_permanent').val(rec['permanent_permanent'])
    $('#permanent_prosthesis').val(rec['permanent_prosthesis'])
    $('#prosthesis_prosthesis').val(rec['prosthesis_prosthesis'])
    $('#need_prosthesis').val(rec['need_prosthesis']) 
    $('#need_scaling').val(rec['need_scaling'])
    $('#oral_lesion_text').val(rec['oral_lesion_text'])
    $('#inspector').val(rec['inspector'])

    const need_pfilling = rec['need_pfilling'].split(' ')
    if(need_pfilling[0] != ""){
            Array.prototype.forEach.call(fields_need_pfilling,function(el){
              need_pfilling.forEach(r =>{
                  if(el.value.includes(r)){
                      el.checked = "checked";
                  } 
              })        
            }); 
    }
    
    $('#main_select').hide() 
    $('#table_app').hide()
    $('#detail').show() 
    showNeed_pfilling()
    addDisabledEl()
  }//end setRec

  function detailPrvBtn(){     
     Swal.fire({
            position: 'center',
            title: 'คุณยังไม่ได้บันทึกข้อมูล ต้องการออกใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
          }).then((result) => {
             if(result.isConfirmed){                  
                removeValidate()
                $('#main_select').show()
                $('#table_app').show()
                $('#detail').hide()                    
                        
             }
          })//then    
  }

  function detailNextBtn(){
     
     if(validateDetail()){ 
         //if(checkDetailForm()){
            $('#detail').hide()
            $('#form1').show()  
         //}       
                  
     }    
  }

//=============================================================================================================
//===========================     detail.js   =================================================================
//=============================================================================================================




//=============================================================================================================
//===========================     form1.js   =================================================================
//=============================================================================================================
  function form1PrvBtn(){
    $('#detail').show() 
    $('#form1').hide()
  }

  function form1NextBtn(){
    if(validateForm1()){
       if(checkForm1()){
         $('#form1').hide()
         $('#form2').show()
          const form2 = document.querySelectorAll("#needs-validation2")    
          Array.prototype.slice.call(form2).forEach(function(form){ 
                form.classList.remove('was-validated')              
          })   
       }       
    }    
  }

  function setPextract(){
     const pteeth = $('#pteeth').val()
     //console.log(pteeth)
     let pextract = 0
     if(Number(pteeth) >= 0 && Number(pteeth) <= 32){
       pextract = 32 - Number(pteeth)
     }
     
     $('#pextract').val(pextract)
  }

  function showNeed_pfilling(){
     const pcaries = $('#pcaries').val()
     if(Number(pcaries) > 0){
       $('#showNeed_pfilling').show()
     }
     else{
       $('#showNeed_pfilling').hide()
     }
  }


//=============================================================================================================
//===========================     form1.js   =================================================================
//=============================================================================================================




//=============================================================================================================
//===========================     form2.js   =================================================================
//=============================================================================================================
  function form2PrvBtn(){
    $('#form2').hide()
    $('#form1').show()
  }

  function showNeed_pfilling(){
     const pcaries = $('#pcaries').val()
     if(Number(pcaries) > 0){
       $('#showNeed_pfilling').show()
     }
     else{
       $('#showNeed_pfilling').hide()
     }
  }

  async function beforeSubmit(){
    document.getElementById("save_btn").disabled = true; 
    if(validateForm2()){
      if(checkForm2()){
        await submitRec()         
      }
    }
    
    document.getElementById("save_btn").disabled = false;
  }

  async function submitRec(){      
    const currDate = new Date().getFullYear()+"/" +(new Date().getMonth() +1) +"/"+new Date().getDate()  
    let rec = {}
    rec['date'] = currDate
    rec['id'] = $('#id_main').val() 
    rec['cup'] = $('#form_cup').val()
    rec['vhid'] = $('#form_vhid').val() 
    rec['cid'] = $('#cid').val()  
    rec['name'] = $('#name').val()
    rec['lname'] = $('#lname').val() 
    rec['fullname'] = $('#name').val() +" "+ $('#lname').val() 
    rec['sex'] = $('#sex').val()   
    rec['age'] = $('#age').val()    
    rec['pteeth'] = Number($('#pteeth').val())
    rec['pcaries'] = Number($('#pcaries').val())

    let need_pfilling = [] // จัดการตัวเลือกแบบ checkbox
    $('input[name="need_pfilling"]:checked').each((i,ele)=>{need_pfilling.push($(ele).val())})
    rec['need_pfilling'] = need_pfilling.join(' ')

    rec['need_pextract'] = $('#need_pextract').val()
    rec['pextract'] = $('#pextract').val()
    rec['pfilling'] = $('#pfilling').val()
    rec['permanent_permanent'] = $('#permanent_permanent').val()    
    rec['permanent_prosthesis'] = $('#permanent_prosthesis').val()
    rec['prosthesis_prosthesis'] = $('#prosthesis_prosthesis').val()
    rec['need_prosthesis'] = $('#need_prosthesis').val()
    rec['need_scaling'] = $('#need_scaling').val()
    rec['oral_lesion_text'] = $('#oral_lesion_text').val()
    rec['inspector'] = $('#inspector').val()
    
    const all = await store.getItem("all_rec_elder").then(function(value) {
        console.log("all_rec_elder retrieved successfully");
        return value
    }).catch(function(error) {
        console.log("Error while retrieving all_rec_elder: " + error);
    });

    all_rec_elder = await JSON.parse(all)    
    if(all_rec_elder == null || all_rec_elder == 'undefined'){
       all_rec_elder = []
    }

    const indx = all_rec_elder.findIndex(r => r['id'] === rec['id']);
    all_rec_elder.splice(indx, indx >= 0 ? 1 : 0);
    all_rec_elder.push(rec);

    if(arrayOfValues != null){
      const indx_main = arrayOfValues.findIndex(r => r['id'] === rec['id']);
      arrayOfValues.splice(indx_main, indx_main >= 0 ? 1 : 0);
      arrayOfValues.push(rec);
    }

    await store.setItem("elder_data", JSON.stringify(arrayOfValues)).then(function() {
       console.log("New Data saved successfully");       
    }).catch(function(error) {
       console.log("Error while saving new data: " + error);
    });

    await store.setItem("all_rec_elder", JSON.stringify(all_rec_elder)).then(function() {
       console.log("New Data for upload saved successfully");       
    }).catch(function(error) {
       console.log("Error while saving new data for upload: " + error);
    });     

    $('#val_total').text("  "+all_rec_elder.length); 
    
    $('#form2').hide()
    $('#main_select').show()
    //$('#table_app').show()
    const tr = document.querySelector('tr#ROWNUMBER\\:' + rec['id']); // ต้อง escape เครื่องหมาย :
    if (tr) {
      console.log("found tr")
      tr.querySelectorAll("td").forEach(td => {
        td.classList.add("text-lime-green");
      });
    }
    else{
      console.log("not found tr")
      await setTable()
    }
     //await setTable()       
    removeValidate()
    Swal.fire({
            position: 'center',
            icon: 'success',
            text: "บันทึกสำเร็จ",
            timer:2000
                     
                }) 
  }

//=============================================================================================================
//===========================     form2.js   =================================================================
//=============================================================================================================




//=============================================================================================================
//===========================     addNewRec.js   =================================================================
//=============================================================================================================
  function generateUniqueId(length) { //อยากได้กี่ตัวให้ใส่จำนวนหลักของตัวอักษรใน parameter length
      const randomStr = Math.random().toString(36).substr(2, length);
      return randomStr;
  }

  function addRecAlert(){
    if(confirm("ต้องการเพิ่มข้อมูล?\nกด ตกลง เพื่อยืนยัน!")){ 
        $('#searchInput').val('')
        $('#searchResults').html('')
        $('#showLength').html('')
        const cup = $('#cup').val()
        if(cup !== "select_all"){
          addNewRec()
        }
        else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: "โปรดเลือก รพสต.",
            timer:5000                     
          }) 
        }
        
     }     
  }

  function addNewRec(){
    removeValidate()         
    const newId = "tempId"+generateUniqueId(10)
    const cup = $('#cup').val()
    //const vhid = $('#vhid').val()    
    $('#id_main').val(newId)
    $('#cid').val('')
    $('#name').val('')
    $('#lname').val('')
    $('#form_cup').val(cup)
    $('#form_vhid').val("")   
    $('#sex').val('')   
    $('#age').val('')    
    $('#pteeth').val('')
    $('#pcaries').val('') 

    const fields_need_pfilling = document.querySelectorAll('input[name="need_pfilling"]');
    Array.prototype.forEach.call(fields_need_pfilling,function(el){               
          el.checked = false;             
    });

    $('#need_pextract').val(0)
    $('#pextract').val(0)
    $('#pfilling').val(0)
    $('#permanent_permanent').val('')    
    $('#permanent_prosthesis').val('')
    $('#prosthesis_prosthesis').val('')
    $('#need_prosthesis').val('4')
    $('#need_scaling').val(0)
    $('#oral_lesion_text').val('')
    $('#inspector').val('')

    $('#main_select').hide()
    $('#table_app').hide()      
    $('#form1').hide()
    $('#form2').hide()
    $('#detail').show()
    showNeed_pfilling()
    removeDisabledEl()
  }

  function removeDisabledEl(){
     document.getElementById("name").disabled = false;
     document.getElementById("lname").disabled = false;
     document.getElementById("cid").disabled = false;
     document.getElementById("sex").disabled = false;
     document.getElementById("age").disabled = false;

  }

  function addDisabledEl(){
     document.getElementById("name").disabled = true;
     document.getElementById("lname").disabled = true;
     document.getElementById("cid").disabled = true;
     document.getElementById("sex").disabled = true;
     document.getElementById("age").disabled = true;

  }

//=============================================================================================================
//===========================     addNewRec.js   =================================================================
//=============================================================================================================




//=============================================================================================================
//===========================     check.js   =================================================================
//=============================================================================================================
  function validateDetail(){
    const forms = document.querySelectorAll("#form_detail")
    
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    return Array.prototype.every.call(forms,function(form){
        return form.checkValidity();
    });
  }

  function validateForm1(){
    const forms = document.querySelectorAll("#needs-validation1")
    
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    return Array.prototype.every.call(forms,function(form){
        return form.checkValidity();
    });
  }

  function validateForm2(){
    const forms = document.querySelectorAll("#needs-validation2")
    
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    return Array.prototype.every.call(forms,function(form){
        return form.checkValidity();
    });
  }

  function removeValidate(){
    const detail = document.querySelectorAll("#form_detail")
    Array.prototype.slice.call(detail).forEach(function(form){ 
        form.classList.remove('was-validated')              
     })

    const form1 = document.querySelectorAll("#needs-validation1")    
     Array.prototype.slice.call(form1).forEach(function(form){ 
        form.classList.remove('was-validated')              
     })

    const form2 = document.querySelectorAll("#needs-validation2")    
     Array.prototype.slice.call(form2).forEach(function(form){ 
          form.classList.remove('was-validated')              
     })        
  }

  function checkForm1(){     
     const pteeth = $('#pteeth').val()
     const pcaries = $('#pcaries').val()
     const pextract = $('#pextract').val() 
     const pfilling = $('#pfilling').val()
     const need_pextract = $('#need_pextract').val()
     

     let need_pfilling = [] // จัดการตัวเลือกแบบ checkbox
     $('input[name="need_pfilling"]:checked').each((i,ele)=>{need_pfilling.push($(ele).val())})      
     
     let sw = true 
     switch(true){
       case Number(pcaries) > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "จำนวนฟันแท้ผุ > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;
        case need_pfilling.length > Number(pcaries) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันแท้ที่ต้องอุด > จำนวนฟันแท้ผุ"
                     
                  })        
             
              sw = false;            
            break;
         
         case Number(pcaries) + Number(pfilling) > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันแท้ที่ผุ + ได้รับการอุด > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break; 

         case Number(need_pextract) > Number(pteeth): 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันแท้ที่ต้องถอน > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;                
         
         case need_pfilling.length + Number(need_pextract) > Number(pteeth) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ฟันแท้ที่ต้องอุด + ต้องถอน > จำนวนฟันแท้ทั้งหมด"
                     
                  })        
             
              sw = false;            
            break;                                             
              
     }
     return sw;
  } 

  function checkForm2(){    
     const pteeth = $('#pteeth').val()
     const pcaries = $('#pcaries').val()
     const soundteeth = Number(pteeth) - Number(pcaries)
     const permanent_permanent = $('#permanent_permanent').val()
     const permanent_prosthesis = $('#permanent_prosthesis').val()
     const prosthesis_prosthesis = $('#prosthesis_prosthesis').val()
     const sum_all = Number(permanent_permanent) + Number(permanent_prosthesis) + Number(prosthesis_prosthesis)  
     
     let sw = true 
     switch(true){
       case sum_all > 10 : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "ผลรวมจำนวนคู่สบทั้งหมด > 10"
                     
                  })        
             
              sw = false;            
            break;

        case soundteeth >= 28 && Number(permanent_permanent) < 5 : 
              Swal.fire({
                       position: 'center',
                       icon: 'error',
                       html: "จำนวนฟันแท้ที่ไม่ผุ >= 28 ซี่ <br> ต้องมีคู่สบฟันแท้-ฟันแท้ >= 5 คู่"
                       
                    })        
               
                sw = false;            
              break;

        case soundteeth == 27 && Number(permanent_permanent) < 4 : 
              Swal.fire({
                       position: 'center',
                       icon: 'error',
                       html: "จำนวนฟันแท้ที่ไม่ผุ = 27 ซี่ <br> ต้องมีคู่สบฟันแท้-ฟันแท้ >= 4 คู่"
                       
                    })        
               
                sw = false;            
              break; 

        case soundteeth == 26 && Number(permanent_permanent) < 3 : 
              Swal.fire({
                       position: 'center',
                       icon: 'error',
                       html: "จำนวนฟันแท้ที่ไม่ผุ = 26 ซี่ <br> ต้องมีคู่สบฟันแท้-ฟันแท้ >= 3 คู่"
                       
                    })        
               
                sw = false;            
              break;

        case Number(pteeth) == 0 && (Number(permanent_permanent) > 0 || Number(permanent_prosthesis) > 0): 
              Swal.fire({
                       position: 'center',
                       icon: 'error',
                       html: "จำนวนฟันแท้ = 0 ซี่ <br> ต้องไม่มีคู่สบฟันแท้-ฟันแท้/ฟันแท้-ฟันเทียม"
                       
                    })        
               
                sw = false;            
              break;                                                     
              
     }
     return sw;
  } 

  function checkDetailForm(){      
     const cid = $('#cid').val()      
     let sw = true 
     switch(true){
       case Number(cid) !== 0 && (Number(cid) < 1000000000000 || Number(cid) > 9999999999999) : 
            Swal.fire({
                     position: 'center',
                     icon: 'error',
                     text: "เลขบัตรต้องมี 13 หลัก เท่านั้น"
                     
                  })        
             
              sw = false;            
            break; 
     }     
     return sw;
  } 

//=============================================================================================================
//===========================     check.js   =================================================================
//=============================================================================================================




  function preventFormSubmit(){
      const forms = document.querySelectorAll('form');
      for (let i = 0; i < forms.length; i++) {
           forms[i].addEventListener('submit', function(event) {
              event.preventDefault();
           });
      }
  }  

  let gUrl, gId, gData;  

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      loadingStart();
      console.log("start");

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      //console.log("ID:", id);
      if (!id) {
        loadingEnd();
        console.log("No ID found in URL.");
        return;
      }
      
      gUrl = mainUrl + '?id=' + id;

      const LOADED_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง
      const stored_exp = await store.getItem('loaded:' + id);
      const now = Date.now();

      if (stored_exp && stored_exp.dataLoaded && now - stored_exp.timestamp < LOADED_EXPIRY_MS) {
        console.log("✅ dom loaded not expired use localforage");
        gId = id
        await callOffLineData()
      } else {
        console.log("⏰ dom loaded expired check API");
        await getDataAPI(gUrl);
        await store.setItem('loaded:' + id, {
          timestamp: now,
          dataLoaded: true
        });
      }

    } catch (error) {
      console.error("Unexpected error in DOMContentLoaded:", error);
    } finally {
      letGoTrim();
      preventFormSubmit();
    }
  });  

 document.getElementById("app").addEventListener("click",clickEventHandler);

  /*window.onbeforeunload = function(event) {    
    event.preventDefault();
    event.returnValue = ''; // จำเป็นสำหรับบางเบราว์เซอร์ (เช่น Chrome) 
      //return confirm('Confirm refresh');
  };*/