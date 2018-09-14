Table of Contents

5.1.11 Collection Modification
==============================

Overview
--------

This section describes modifying the schema and the index of a GridDB collection.

  

Schema Modification
-------------------

You can modify the schema by adding or deleting columns in a container after the container has been created.  
This example demonstrates how to modify a newly created class with a new column in addition to `WeatherStation` class.  
In addition, there is a way to modify the schema without creating a new class. Please refer to [Meta-information](5-1-22_metainfo.php) for more details.

**List.1 Modified Class** (AnotherWeatherStation.java)

package sample.row;

import com.toshiba.mwcloud.gs.RowKey;

public class AnotherWeatherStation {
    / \*\*
    \* ID of WeatherStation
    \* /
    @RowKey
    public String id;

    / \*\*
    \* Name of WeatherStation
    \* /
    public String name;

    / \*\*
    \* Installation Latitude
    \* /
    public double latitude;

    / \*\*
    \* Installation Longitude
    \* /
    public double longitude;

    / \*\*
    \* Camera exists or not
    \* /
    public boolean hasCamera;

    / \*\*
    \* Added field to WeatherStation
    \* /
    public String description;
}

*   L.35: The newly added column.

In the case creating a new collection, the `GridStore.putCollection(String, Class)` method is used, and the case modifying schema of column, the method with parameters of modification options `GridStore.putCollection(String, Class, boolean)` is used.

**List.2 putCollection Method**

< K, R > Collection < K, R > putCollection (java.lang.String name,
                                    java.lang.Class < R > rowType,
                                    boolean modifiable)
                                    throws GSException

You can modify a schema of an existing collection with setting the modifiable parameter to true.  
However there are several conditions in order to modify. Please refer to [GridDB API Reference](../GridDB_API_Reference.html) for more information.

**List.3 Modifying the collection to be added a new column** (CollectionModify.java)

// Modify ano ther schema Collection
Collection ano therWeatherStationCol =
        store.putCollection("weather_station", AnotherWeatherStation.class, true ); 

*   L.29-30: Set the `modifiable` paramater to true.

  

Add an Index
------------

You can set an Index to column in GridDB identically with general RDB.

**List.4 Adding an Index** (CollectionIndex.java)

// Create Index
weatherStationCol.createIndex("id");
weatherStationCol.createIndex("name", IndexType.TREE);

*   L.34: Add an index with specifying a column name id of the measuring instrument ID with `Container.createIndex(String)` method.
*   L.35: Add ab index specifying a column name of the measuring instrument name with `Container.createIndex(String, IndexType)` method and set `IndexType.TREE` to the index type.

Types of indexes are as follows:

**Table.1 Index types**

Index type

Description

HASH

High speed retrieval, but not suitable for the operation of reading Row sequentially and impossible to set in the TimeSeries container.

TREE

It is suitable for a retrival specifying that whether the value is larger or smaller than a retrieval vulue to a retrieval range.

There are index types which can not be specified owing to the container type or the column type. Please refer to [GridDB API Reference](../GridDB_API_Reference.html) and [GridDB Technical Reference](../GridDB_TechnicalReference.pdf) for more information.

  

Delete an Index
---------------

Index set in the column can be deleted.

**List.5 Delete an Index** (CollectionIndex.java)

// Drop Index
weatherStationCol.dropIndex("id");
weatherStationCol.dropIndex("name");

*   L.38-39: Delete an Index with the `Container.dropIndex (String)` method specifying column name set to the index.

  

Complete source code
--------------------

Complete source code used in this sample can be downloaded from the following.

Download: [collection_modify.zip](img/collection-modify.zip)
