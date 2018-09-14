Table of Contents

5.1.9 Data Retrieval
====================

Overview
--------

This chapter covers retrieving data using the GridDB API.

  

Retrieve data
-------------

Retrieve data in a collection with specifying a Row key.

**List.1 Data Read** (WeatherStationLogic.java)

// Get Collection
Collection weatherStationCol =
        store.getCollection("weather_station", WeatherStation.class);
} 

*   L.24-25: Retrieve a collection by specifying a container name

**List.2 Data Read by Row Key**(CollectionRetrieve.java)

try {
    System.out.println("ID \\tName \\t \\t \\tLongitude \\tLatitude \\tCamera");
    for (int i=0; i < WeatherStationLogic.JP_PREFECTURE; i ++) {
        // Retrieve row by key
        WeatherStation weatherStation=weatherStationCol.get (String.valueOf (i + 1));
        System.out.println (String.format("% - 3s \\t% -20s \\t% -10s \\t% -10s \\t% -5s",
        weatherStation.id, weatherStation.name, weatherStation.latitude,
        weatherStation.longitude, weatherStation.hasCamera));
    }
} Finally {
    // Close Connection
    weatherStationCol.close ();
}

*   L.31: Retrieve a Row with specifying the measuring instrument ID of the key.

  
Execution results are as follows.

**List.3 Result**

ID  Name            Longitude   Latitude    Camera
1   Hokkaido-Sapporo    43.06417    141.34694   true
2   Aomori-Aomori       40.82444    140.74      false
3   Iwate-Morioka       39.70361    141.1525    true
4   Miyagi-Sendai       38.26889    140.87194   false
5   Akita-Akita     39.71861    140.1025    true
(Snip)

  

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [collection-retrieve.zip](img/collection-retrieve.zip)
