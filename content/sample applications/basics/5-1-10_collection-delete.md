Table of Contents

5.1.10 Data Deletion
====================

Overview
--------

This chapter covers deleting data from a GridDB collection.

  

Delete data
-----------

Delete data from a collection with specifying a Row key.

**List.1 Delete Data** (CollectionDeleteRow.java)

// Get Collection
Collection weatherStationCol =
        store.getCollection("weather_station", WeatherStation.class);

// Delete Row
boolean deleteSucceed = weatherStationCol.remove("1");
System.out.println("Delete Succeed:" + deleteSucceed);

System.out.println("ID\\tName\\t\\t\\tLongitude\\tLatitude\\tCamera");
for (int i = 0; i < WeatherStationLogic.JP_PREFECTURE; i++) {
    // Retrieve row by key
    WeatherStation weatherStation = weatherStationCol.get(String.valueOf(i + 1));
    if (weatherStation != null) {
        System.out.println(String.format("%-3s\\t%-20s\\t%-10s\\t%-10s\\t%-5s",
                weatherStation.id, weatherStation.name, weatherStation.latitude,
                weatherStation.longitude, weatherStation.hasCamera));
    } else {
        System.out.println(String.format("ID:%s is not exist", (i + 1)));
    }
}

*   L.28: Delete a Row with specifying the measuring instrument ID using `Container.remove(String)` method. If the deletion was sucesseful, the return value is True.
*   L.32-42: Display the retrieved data after the deletion.

  
Execution results are as follows:

**List.2 Result**

Delete Succeed:true
ID  Name        Longitude   Latitude    Camera
ID: 1 does not exist
2   Aomori-Aomori   40.82444    140.74      false
3   Iwate-Morioka   39.70361    141.1525    true
4   Miyagi-Sendai   38.26889    140.87194   false
5   Akita-Akita 39.71861    140.1025    true
(Snip)

  

Complete Source Code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [griddb-delete.zip](img/collection-delete.zip)
