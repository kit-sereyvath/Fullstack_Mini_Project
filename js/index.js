let table = document.getElementById("records-table")

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
                    let k = 0
                    for(let i = 0; i < data.length && i < table.children[0].childElementCount - 1; i++){
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
                    let k = 0
                    for(let i = 0; i < data.length && k < table.children[0].childElementCount - 1; i++){
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
                    let k = 0
                    for(let i = 0; i < data.length && k < table.children[0].childElementCount - 1; i++){
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
                response.json().then((data) => {
                    let datee = extractDate(data.id)
                    let province_name = extractProvince(data)

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

//display data to the table
function displayTable(data, datee, province_name, k){
    //Referenc to all available table row
    let t_date = table.children[0].children[k+1].children[0]
    let t_province = table.children[0].children[k+1].children[1]
    let t_high = table.children[0].children[k+1].children[2]
    let t_avg = table.children[0].children[k+1].children[3]
    let t_low = table.children[0].children[k+1].children[4]
    let t_cond = table.children[0].children[k+1].children[5]

    //display the data in the table
    t_date.innerHTML = datee
    t_province.innerHTML = province_name
    t_high.innerHTML = data.highTemp + "°C"
    t_avg.innerHTML = data.avgTemp + "°C"
    t_low.innerHTML = data.lowTemp + "°C"
    t_cond.innerHTML = data.cond
}

function favorFunction(x) {
    x.classList.toggle("fa-heart-o");
}

favorFunction(document.getElementsByTagName("i")[0])