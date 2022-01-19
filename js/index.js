let table = document.getElementById("table")
let table_sample = document.getElementById("sample")
let all_data;

//fill the table with all data when the page is open
fetch('http://localhost:3000/Cambodia').then((response) => {
    if(response.status == 200){
        table.style.display = "block"
        prepareTable()
        all_data = response.json()
        all_data.then((data) => { //I should consider using foreach(data) instead
            let k = 0
            for(let i = data.length - 1; i >= 0; i--){
                let datee = extractDate(data[i].id)
                let province_name = extractProvince(data[i].id)
                
                displayTable(data[i], datee, province_name, i)
                k++
            }
        })
    }
})


//handle insertion of data
function insert(){
    let date = document.getElementById("date").value    
    let province = document.getElementById("province").value
    let hightemp = document.getElementById("hightemp").value
    let avgtemp = document.getElementById("avgtemp").value
    let lowtemp = document.getElementById("lowtemp").value
    let condition = document.getElementById("condition").value

    let id = date + province
    let weather_data = {
        id: id,
        avgTemp: avgtemp,
        highTemp: hightemp,
        lowTemp: lowtemp,
        cond: condition
    }

    if (province != "none" && date != "")
        fetch('http://localhost:3000/Cambodia/', {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(weather_data)
        }).then((response) => {
            if (response.status == 201) {
                alert("The weather data of " + province + " on " + date + " was INSERTED successfully!")
            }
            else if (response.status == 500)
                alert("The weather data of " + province + " on " + date + " already exist!\n" + "Consider EDIT the data instead.")
        })
}

//handle updation of data
function update(){
    let date = document.getElementById("date").value    
    let province = document.getElementById("province").value
    let hightemp = document.getElementById("hightemp").value
    let avgtemp = document.getElementById("avgtemp").value
    let lowtemp = document.getElementById("lowtemp").value
    let condition = document.getElementById("condition").value

    let id = date + province
    let weather_data = {
        id: id,
        avgTemp: avgtemp,
        highTemp: hightemp,
        lowTemp: lowtemp,
        cond: condition
    }

    fetch('http://localhost:3000/Cambodia/' + id, {
        method: "PUT",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(weather_data)
    }).then((response) => {
        if (response.status == 200) {
            alert("The weather data of " + province + " on " + date + " wae UPDATED successfully!")
        }
        else if (response.status == 404)
            alert("There is no weather data of " + province + " on " + date + "!\n" + "Consider INSERT the data instead.")
        else if (response.status == 500)
            alert("There is error in the server. Please try again later!")
    })
}

//handle data deletion
function deleted(){
    let date = document.getElementById("date").value    
    let province = document.getElementById("province").value
    let id = date + province

    //delete everything
    if (date == "" && province == "none"){
        let confirm = prompt("You are about to DELETE EVERYTHING!\nPlease type \"deleteall\" to confirm your decision:");
        if (confirm == "deleteall") {
            fetch('http://localhost:3000/Cambodia').then((response) => {
                if(response.status == 200){
                    response.json().then((data) => {
                        for(let i = 0; i < data.length; i++){
                            fetch('http://localhost:3000/Cambodia/' + data[i].id, {
                                method: "DELETE"
                            })
                        }
                        alert("All weather data were DELETED successfully!"); 
                    })
                } else if (response.status == 404){
                    alert("Threre is no data to DELETE!")
                } else if (response.status == 500){
                    alert("There is error in the server. Please try again later!")
                }
            })
        }
        
    } 
    
    //delete data by date
    else if (province == "none" && date != ""){
        fetch('http://localhost:3000/Cambodia').then((response) => {
            if(response.status == 200){
                response.json().then((data) => {
                    for(let i = 0; i < data.length; i++){
                        let datee = extractDate(data[i].id)
                        let dated = extractDate(id)

                        console.log(dated + " " + datee);
                        if (dated == datee) {
                            fetch('http://localhost:3000/Cambodia/' + data[i].id, {
                                method: "DELETE"
                            })
                        }
                    }
                    alert("All weather data on " + date + " were DELETED successfully!");
                })
            } else if (response.status == 404){
                alert("No data was FOUND!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }


    //delete data by province
    else if (province != "none" && date == ""){
        fetch('http://localhost:3000/Cambodia').then((response) => {
            if(response.status == 200){
                response.json().then((data) => {
                    for(let i = 0; i < data.length; i++){
                        let province_name = extractProvince(data[i].id)

                        if (province == province_name) {
                            fetch('http://localhost:3000/Cambodia/' + data[i].id, {
                                method: "DELETE"
                            })
                        }
                    }
                    alert("All weather data of " + province + " were DELETED successfully!");
                })
            } else if (response.status == 404){
                alert("No data was FOUND!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }

    //delete by using id (date and province)
    else if (province != "none" && date != "") {
        fetch('http://localhost:3000/Cambodia/' + id, {
            method: "DELETE"
        }).then((response) => {
            if(response.status == 200){
                alert("The weather data of " + province + " on " + date + " was DELETED! successfully!")
            } else if (response.status == 404){
                alert("There weather data of " + province + " on " + date + " does not EXIST!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }
}

//handle data finding
function find(){
    let date = document.getElementById("date")    
    let province = document.getElementById("province")
    let id = date.value + province.value

    
    
    //find all data
    if (id == "none"){
        fetch('http://localhost:3000/Cambodia').then((response) => {
            if(response.status == 200){
                response.json().then((data) => { //I should consider using foreach(data) instead
                    table.style.display = "block"
                    prepareTable()
                    let k = 0
                    for(let i = 0; i < data.length; i++){
                        let datee = extractDate(data[i].id)
                        let province_name = extractProvince(data[i].id)
                        
                        displayTable(data[i], datee, province_name, i)
                        k++
                    }
                    if (k == 0){
                        alert("No data was FOUND!")
                    }
                })
            } else if (response.status == 404){
                alert("No data was FOUND!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }

    //find data by date
    else if (province.value == "none" && date.value != ""){
        fetch('http://localhost:3000/Cambodia').then((response) => {
            if(response.status == 200){
                response.json().then((data) => {
                    table.style.display = "block"
                    prepareTable()
                    let k = 0
                    for(let i = 0; i < data.length; i++){
                        let datee = extractDate(data[i].id)
                        let dated = extractDate(id)
                        let province_name = extractProvince(data[i].id)

                        if (dated == datee) {
                            displayTable(data[i], datee, province_name, k)
                            k++;
                        }
                    }
                    if(k == 0)
                        alert("No data was FOUND!")
                })
            } else if (response.status == 404){
                alert("No data was FOUND!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }


    //find data by province
    else if (province.value != "none" && date.value == ""){
        fetch('http://localhost:3000/Cambodia').then((response) => {
            if(response.status == 200){
                response.json().then((data) => {
                    table.style.display = "block"
                    prepareTable()
                    let k = 0
                    for(let i = 0; i < data.length; i++){
                        let datee = extractDate(data[i].id)
                        let province_name = extractProvince(data[i].id)
                        
                        if (province.value == province_name) {
                            displayTable(data[i], datee, province_name, k)
                            k++;
                        }
                    }
                    if(k == 0)
                        alert("No data was FOUND!")
                })
            } else if (response.status == 404){
                alert("No data was FOUND!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }


    //find data with id (date and province)
    else if (province.value != "none" && date.value != "") {
        fetch('http://localhost:3000/Cambodia/' + id).then((response) => {
            if(response.status == 200){
                table.style.display = "block"
                prepareTable()
                response.json().then((data) => {
                    let datee = extractDate(data.id)
                    let province_name = extractProvince(data.id)

                    displayTable(data, datee, province_name, 0)
                })
            } else if (response.status == 404){
                alert("The weather data of " + province.value + " on " + date.value + " does not EXIST!")
            } else if (response.status == 500){
                alert("There is error in the server. Please try again later!")
            }
        })
    }
}

//handle displaying favourite data
function favcol(){
    table.style.display = "block"
    prepareTable()
    all_data.then((data) => {
        data.forEach((element) => {
            if(element.isfavor){
                displayTable(element, extractDate(element.id), extractProvince(element.id), 1)
            }
        })
    })
}

//handle row clicking and display detail
function row_detail(x){
      swal(x.children[1].innerHTML, `Date: ${x.children[0].innerHTML}\n
      Highest Temperature: ${x.children[2].innerHTML}\n
      Average Temperature: ${x.children[3].innerHTML}\n
      Lowest Temperature: ${x.children[4].innerHTML}\n
      Sky Condition: ${x.children[5].innerHTML}`); 
}






//extract date from id
function extractDate(data){
    let datee = data[5] + data[6] + '/' + data[8] + data[9] + '/' + data[0] + data[1] + data[2] + data[3]

    return datee;
}

//extract province from id
function extractProvince(data){
    let province_name = ""
    for( let j = 10; j < data.length; j++)
        province_name += data[j]
    return province_name
}

//function prepareTable(tab)
function prepareTable(){
    try{
        table.children[1].remove()
    } catch(e){}

    let tb = document.createElement("table")
    tb.setAttribute("id", "records-table")

    let tr = document.createElement("tr")
    let date = document.createElement("th")
    date.innerHTML = "Date (d/m/y)"
    tr.appendChild(date)
    let city = document.createElement("th")
    city.innerHTML = "City/Province"
    tr.appendChild(city)
    let high = document.createElement("th")
    high.innerHTML = "Highest Temp"
    tr.appendChild(high)
    let avg = document.createElement("th")
    avg.innerHTML = "Average Temp"
    tr.appendChild(avg)
    let low = document.createElement("th")
    low.innerHTML = "Lowest Temp"
    tr.appendChild(low)
    let cond = document.createElement("th")
    cond.innerHTML = "Condition"
    tr.appendChild(cond)

    tb.appendChild(tr)
    table.appendChild(tb)
}

//display data to the table
function displayTable(data, datee, province_name, k){
    let tr = document.createElement("tr")
    tr.setAttribute("id", data.id)
    tr.setAttribute("onclick", "row_detail(this)")
    let date = document.createElement("td")
    date.innerHTML = datee
    tr.appendChild(date)
    let city = document.createElement("td")
    city.innerHTML = province_name
    tr.appendChild(city)
    let high = document.createElement("td")
    high.innerHTML = data.highTemp + "°C"
    tr.appendChild(high)
    let avg = document.createElement("td")
    avg.innerHTML = data.avgTemp + "°C"
    tr.appendChild(avg)
    let low = document.createElement("td")
    low.innerHTML = data.lowTemp + "°C"
    tr.appendChild(low)
    let cond = document.createElement("td")
    cond.innerHTML = data.cond
    tr.appendChild(cond)
    let fav = document.createElement("td")
    let icon = document.createElement("i")
    icon.setAttribute("class", "fa fa-heart")
    icon.setAttribute("onclick", "favorFunction(this)")
    icon.setAttribute("icheck", "f")
    icon.setAttribute("idi", data.id)
    if(!data.isfavor){
        favorFunction(icon)
        icon.setAttribute("icheck", "t")
    } else {
        icon.setAttribute("icheck", "t")
    }
    fav.appendChild(icon)
    tr.appendChild(fav)
    table.children[1].appendChild(tr)
}

function favorFunction(x) {
    x.classList.toggle("fa-heart-o");
    let id = x.getAttribute("idi")
    
    if(x.getAttribute("icheck") === "t"){
        all_data.then((data) => {
            data.forEach(element => {
                if(element.id === id){
                    element.isfavor = !element.isfavor
                    fetch('http://localhost:3000/Cambodia/' + id, {
                        method: "PUT",
                        headers: {"content-type": "application/json"},
                        body: JSON.stringify(element)
                    })
                }
            })
        })
    }
}