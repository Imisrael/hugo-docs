Table of Contents

5.1.7 Container Creation and Deletion
=====================================

Overview
--------

This chapter describes how to create/delete GridDB containers.

  

Collection and Timeseries Container
-----------------------------------

There are 2 container types, a **timeseries container** and a **collection**.

*   Timeseries container
    *   A container that specializes for data whcih is consisted of the pair of time and value, such as sensor data.
    *   The TIMESTAMP data can be specified in a row key.
    *   It is possible to acquire the data in a specified period of time or to aggregate the data.
    *   Value can be linearly interpolated when register or retreive the data.
*   Collection
    *   Collection is a general purpose container.
    *   Collection does not have any functions related to timeseries data, however it can be used with any data type in a key and it can be used in the same way as the other key-value database.

Here are some programming samples to create or delete each type of containers.

  

How to create a Collection
--------------------------

Collection can be created as follows.

**List.1 Creating a Collection**(WeatherStationLogic.java)

// Create Collection
Collection<String, WeatherStation> weatherStationCol =
        store.putCollection("weather_station", WeatherStation.class);
return weatherStationCol;

*   L.34-35: Use `GridStore.putCollection(String, Class)` method to create a Collection.  
    A container name should be specified to `String`, and `WeatherStation` class which can be created in chapter [Schema definition](5-1-6_container-schema.php) should be set to `Class`.  
    A created Collection will obtained as an instance of `com.toshiba.mwcloud.gs.Collection` class.

  

**List.2 Releasing a Collection**(CollectionCreate.java)

} finally {
    // Close Connection
    weatherStationCol.close();
}

*   L.183: Use `Collection.close()` method to release associated resources by closing the created Collection.

  

How to create a Timeseries Container
------------------------------------

Timeseries Container can be created as follows.

**List.3 Creating a Timeseries Container**(InstrumentLogLogic.java)

for (int i = 0; i < WeatherStationLogic.JP_PREFECTURE; i++) {
    // Create TimeSeries Container
    TimeSeries<InstrumentLog> ts =
            store.putTimeSeries("weather\_station\_" + (i + 1), InstrumentLog.class);

    (snip)
}

*   L.137-138: Use `GridStore.putTimeSeries(String, Class)` method to create a Timeseries Container.  
    A Timeseries container name should be specified to `String`, and `InstrumentLog` class which can be created in chapter [Schema definition](5-1-6_container-schema.php) should be set to `Class`.  
    A created Timeseries Container will obtained as an instance of `com.toshiba.mwcloud.gs.TimeSeries` class.

  
**List.4 Releasing a Timeseries Container**(InstrumentLogLogic.java)

// Close TimeSeries Container
ts.close();

*   L.56: In the same manner as Collection, use `Collection.close()` method to release associated resources by closing the created Timeseries Container.

  

How to delete a Container
-------------------------

**List.5 Deleting Collection**(WeatherStationLogic.java)

public void dropCollection(GridStore store) throws GSException {
    // Drop Collection
    store.dropCollection("weather_station");
}

*   L.47: Use `GridStore.dropCollection(String)` method to delete a Collection.

  

**List.6 Deleting Timeseries Container**(SampleTimeSeries.java)

public void dropTimeSeries(GridStore store, String name) throws GSException {
    // Drop TimeSeries Container
    store.dropTimeSeries(name);
}

*   L.69: Use `GridStore.dropTimeSeries(String)` method to delete a Timeseries Container.

* * *

This chapter provided how to create or delete 2 types of Container, a **Collection** and a **Timeseries Container**.  
Container can be easily created or deleted by simply preparing a container name and a class that represents the rows.

Here we describe only the static method of preparing a class that represents a row in advance, but there is a way to dynamically create a Container without providing a class.  
Please refer to [Meta-information](5-1-22_metainfo.php) for more details.

  

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [container-create-drop.zip](img/container-create-drop.zip)
