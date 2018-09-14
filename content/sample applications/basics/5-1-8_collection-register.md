Table of Contents

5.1.8 Collection Registration
=============================

Overview
--------

This chapter describes registering data in a GridDB collection.

  

Data to be registered
---------------------

Create registration data in a CSV file with the contents as follows:

*   Measuring instrument CSV file
    *   File name
        *   `Weather_station.csv`
    *   Retention data
        *   Row 1: measuring instrument ID
        *   Row 2: The name
        *   Row 3: installation coordinates (latitude)
        *   Row 4: installation coordinates (longitude)
        *   Row 5: camera presence

  
**List.1 Data File** (weather_station.csv)

1,Hokkaido-Sapporo,43.06417,141.34694,true
2,Aomori-Aomori-City,40.82444,140.74,false
3,Iwate-Morioka,39.70361,141.1525,true
4,Miyagi-Sendai,38.26889,140.87194,false
5,Akita-Akita,39.71861,140.1025,true
(Snip)

Data registration
-----------------

The following code demonstrates registering data:

**List.2 Simple Data Registration** (CollectionRegister.java)

// Read WeatherStation data from csv
List weatherStationList=wsLogic.readCsv ();
// Register Collection
wsLogic.registerCollection (store, weatherStationList); 

*   L.26: Read the CSV to get a list of measuring instruments.
*   L.28: Register the list of measuring instruments in a GridDB collection.

  
**List.3 Read CSV** (WeatherStationLogic.java)

public List<WeatherStation> readCsv() throws IOException {
    List<WeatherStation> weatherStationList = new ArrayList<WeatherStation>();
    // Read CSV file
    CSVReader reader = new CSVReader(new FileReader("data/weather_station.csv"));

    try {
        String\[\] line = null;
        WeatherStation weatherStation = null;

        // Read all line of CSV
        while ((line = reader.readNext()) != null) {
            // Set the value to Row of WeatherStation
            weatherStation = new WeatherStation();
            weatherStation.id = line\[0\];
            weatherStation.name = line\[1\];
            weatherStation.latitude = Double.valueOf(line\[2\]);
            weatherStation.longitude = Double.valueOf(line\[3\]);
            weatherStation.hasCamera = Boolean.valueOf(line\[4\]);

            // Add Collection
            weatherStationList.add(weatherStation);
        }
    } finally {
        // Close CSV
        reader.close();
    }
    return weatherStationList;
}

### Read CSV

*   L.31: Read a CSV file `weather_station.csv` that contains the measuring instrument's data. The operation of reading the CSV file uses the `CSVReader` class of which is an open source software [opencsv](http://opencsv.sourceforge.net/).
*   L.38-45: Read the contents of the CSV and set the values to an instance of `WeatherStation`.

  

### Register Collection

**List.4 Register Data** (WeatherStationLogic.java)

public void registerCollection(GridStore store, List<WeatherStation> weatherStationList)
        throws GSException {
    // Get Collection
    Collection<String, WeatherStation> weatherStationCol =
            store.getCollection("weather_station", WeatherStation.class);
    try {
        // Disable Auto Commit
        weatherStationCol.setAutoCommit(false);

        boolean isSuccess = true;

        for (WeatherStation weatherStation : weatherStationList) {
            if (weatherStation != null) {
                // Add Collection
                weatherStationCol.put(weatherStation.id, weatherStation);
            } else {
                // if Row Data is null, abort register
                weatherStationCol.abort();
                System.out.println("Register of the Collection is aborted.");
                isSuccess = false;
                break;
            }
        }

        // Commit only when the registration was successful all
        if (isSuccess) {
            // Commit
            weatherStationCol.commit();
        }
    } finally {
        // Close Connection
        weatherStationCol.close();
    }
}

### Get Container

*   L.67-68: Get the subject of container to be registered.

  

### Auto-commit

*   L.71: Disable auto-commit.

Auto-commit is set by `Collection.setAutoCommit ()` method. Auto-commit by default in GridDB is enabled.  
When you register the data collectively, to disable auto-commit makes a reduction in the number of times of the inquiry, therefore increasing the throughput is expectable.

### Add Data

*   L.78: Add the value read from CSV to the collection.

In this code auto-commit is disabled, but If auto-commit is enabled, the data will be registered here.

### Commit

*   L.91: Commit to a collection.

Commit is executed by `Collection.commit ()` method. If auto-commit is disabled, the data is registered here.

### Roll back

*   L.81: Execute rollback to collection.

Rollback is executed by `Collection.abort ()` method.  
Rollback must be executed only when an exception occurs other than `GSException` or problems are detected. Otherwise operation of the pre-commit will be canceled if an exception `GSException` occurs when auto-commit is disabled.  
In this sample, if the data of the measuring instrument read from the CSV is NULL, execute rollback assuming that a problem occurs.

  

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [collection-register.zip](img/collection-register.zip)
