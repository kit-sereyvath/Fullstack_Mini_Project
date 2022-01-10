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

    fetch('http://localhost:3000/Cambodia/', {
                    method: "POST",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify(weather_data)
                }).then((response) => {
                    if (response.status == 201) {
                        alert("The weather data of " + province + " on " + date + " wae INSERTED successfully!")
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
        if (response.status == 201) {
            alert("The weather data of " + province + " on " + date + " wae UPDATED successfully!")
        }
        else if (response.status == 404)
            alert("There is no weather data of " + province + " on " + date + "!\n" + "Consider INSERT the data instead.")
    })
}

//handle data deletion
function deleted(){
    let date = document.getElementById("date").value    
    let province = document.getElementById("province").value
    let id = date + province

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
                }
            })
        }
        
    }

    if (id != "none") {
        fetch('http://localhost:3000/Cambodia/' + id, {
            method: "DELETE"
        }).then((response) => {
            if(response.status == 200){
                alert("The weather data of " + province + " on " + date + " was DELETED! successfully!")
            } else if (response.status == 404){
                alert("There weather data of " + province + " on " + date + " does not EXIST!")
            }
        })
    }
}

//handle data finding
function find(){
    let date = document.getElementById("date")    
    let province = document.getElementById("province")
    let id = date.value + province.value

    let t_date = document.getElementById("records-table").children[0].children[1].children[0]
    let t_province = document.getElementById("records-table").children[0].children[1].children[1]
    let t_high = document.getElementById("records-table").children[0].children[1].children[2]
    let t_avg = document.getElementById("records-table").children[0].children[1].children[3]
    let t_low = document.getElementById("records-table").children[0].children[1].children[4]
    let t_cond = document.getElementById("records-table").children[0].children[1].children[5]

    fetch('http://localhost:3000/Cambodia/' + id).then((response) => {
        if(response.status == 200){
            response.json().then((data) => {
                let datee = data.id[5] + data.id[6] + '/' + data.id[8] + data.id[9] + '/' + data.id[0] + data.id[1] + data.id[2] + data.id[3]
                let province = ''
                for( let i = 10; i < data.id.length; i++)
                    province += data.id[i]
                t_date.innerHTML = datee
                t_province.innerHTML = province
                t_high.innerHTML = data.highTemp + "°C"
                t_avg.innerHTML = data.avgTemp + "°C"
                t_avg.innerHTML = data.lowTemp + "°C"
                t_cond.innerHTML = data.cond
            })
        } else if (response.status == 404){
            alert("The weather data of " + province.value + " on " + date.value + " does not EXIST!")
        }
    })
}