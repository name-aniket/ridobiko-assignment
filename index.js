$(document).ready(() => {
  /**
   * dataset holds the record from the json file
   * userData holds the record which user selected from the dropdown
   */
  let dataset = null;
  let userData = null;

  /**
   * This function loads the data from the JSON file.
   */
  $(() => {
    $.getJSON("data.json", (data) => {
      dataset = data;
      let city = new Set();
      let type = new Set();

      $.each(data, (key, value) => {
        city.add(value.city);
        type.add(value.type);
      });

      $("#city").append(
        $("<option></option>").attr("value", -1).text("Select a city")
      );

      Array.from(city, (c) => {
        $("#city").append($("<option></option>").attr("value", c).text(c));
      });

      $("#type").append(
        $("<option></option>").attr("value", -1).text("Vehicle Type")
      );

      Array.from(type, (c) => {
        $("#type").append($("<option></option>").attr("value", c).text(c));
      });

      /**
       * This is a utility function which
       * creates the ride view.
       */
      createRideTemplate(data);
    });
  });

  /**
   * This function is use to create ride template
   * @param {*} data
   */
  const createRideTemplate = (data) => {
    $("#rides").empty();
    $.each(data, (key, value) => {
      str = "";
      str += '<div class="col-sm-4"><div class="card" style="width: 20rem;">';
      str += '<div class="embed-responsive embed-responsive-16by9">';
      str += `<img src="assets/img/${value.image}" class="card-img-top embed-responsive-item" alt=""></div>`;
      str += '<div class="card-body">';
      str += `<h5 class="card-title">${value.bike_name}</h5>`;
      str += '<ul class="list-group list-group-flush">';
      str += `<li class="list-group-item"> <b>Rate</b> &#8377 ${value.price} per day</li>`;
      str += `<li class="list-group-item"> <b>Deposit</b> &#8377 ${value.deposit} </li>`;
      str += `<li class="list-group-item"> <b>Vehicle Type</b> ${value.vehicle_type}</li>`;
      str += "</ul>";
      str += '<div class="card-body">';
      str += '<a href="#" class="btn btn-danger">Book Now</a>';
      str += "</div>";
      str += "</div>";
      str += "</div>";
      str += "</div>";
      $("#rides").append(str);
    });
  };

  /**
   * This function is used to create filter template
   * @param {*} data
   */
  const createFilterTemplate = (data) => {
    const unorderedList = $("#type_filter");
    let vehicle_type = new Set();

    $.each(data, (key, value) => {
      vehicle_type.add(value.vehicle_type);
    });

    unorderedList.empty();
    unorderedList.append("<p><h3>Vehicle Type Filter</h3></p>");

    let index = 0;
    Array.from(vehicle_type, (value) => {
      let str = "";
      str += '<li class="list-group-item">';
      str += '<div class="custom-control custom-checkbox">';
      str += `<input type="checkbox" class="custom-control-input" id="check${index}" value="${value}">`;
      str += `<label class="custom-control-label" for="check${index}">${value}</label>`;
      str += "</div>";
      str += "</li>";
      unorderedList.append(str);
      index += 1;
    });
  };

  /**
   * This a an event handler for SEARCH button.
   */
  $("#find_ride").click(() => {
    const city = $("#city").val();
    const type = $("#type").val();

    let searchData = [];

    if (city != -1 && type != -1) {
      $.each(dataset, (key, value) => {
        if (value.city === city && value.type === type) searchData.push(value);
      });

      // If the array has atleast 1 element
      if (searchData.length) {
        userData = searchData;
        createRideTemplate(searchData);
        createFilterTemplate(searchData);
      }
    }
  });

  /**
   * Event handler for checkbox state change.
   */
  $(document).on("change", "input[class='custom-control-input']", (event) => {
    let filterValue = new Set();

    for (i = 0; i < userData.length; i++) {
      if ($(`#check${i}`).is(":checked"))
        filterValue.add($(`#check${i}`).val());
    }

    const filterSearch = userData.filter((value) => {
      return filterValue.has(value.vehicle_type);
    });

    filterSearch.length
      ? createRideTemplate(filterSearch)
      : createRideTemplate(userData);
  });
});
