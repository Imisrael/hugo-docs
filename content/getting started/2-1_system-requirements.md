+++
title = "System Requirements"
weight = 1
+++


### Checking the Required Resources

GridDB is a scale-out database that -- unlike a conventional database -- pre-planning of the system design and sizing is not required in order to achieve non-stop operation. However, the following points should be considered as guidelines in the initial system design:

*   Memory usage
*   Number of nodes in a cluster
*   Disk usage

The estimation method is explained in sequence below.

Functions to increase the capacity by using external storage devices such as SSDs, etc. have not been considered in calculating the memory size below. Please check with our service desk for estimation if these functions are used.

#### **Total memory usage**

1\. Predict the amount of data to be stored in the application. Estimate the following:

*   Data size of row
*   Number of rows to be registered

2\. Estimate the memory required to store those estimated data.

Memory capacity used = row data size × no. of registered rows ÷ 0.75 + 8 × no. of registered rows × (assigned index number + 2) ÷ 0.66 (byte)

3\. Perform a similar estimation for all collections created and used in the application. The total sum becomes the amount of memory required in the GridDB cluster.

Total memory usage = the sum of memory usage in all collections

_Note: please consider this number as the minimum requirement, as the memory usage also depends on update frequency._

#### **Number of Nodes Constituting a Cluster**

Estimate the required no. of nodes used in GridDB. In the example below, it is assumed that one node is executed in one machine.

First, make an assumption of the memory required per machine.  
In addition, make an assumption of the no. of replicas to create. The no. of replicas is given as a GridDB configuration value.

#### **Disk Usage**

Estimate the size of the file to be created in GridDB, and the disk capacity required for the machine to execute a node. Two types of files should be created; a checkpoint file and a transaction log file.

The memory usage of individual node is determined as follows:

Individual memory usage = (total memory usage * no. of replicas) ÷ no. of nodes (byte) 

The size of the checkpoint file is estimated as follows based on this numerical value.

File size = Individual memory usage * 2 (byte)

In addition, as the transaction log life size is dependent on the update frequency of the application, the following data is thus predicted.

Row update frequency (times/sec)

Furthermore, the checkpoint interval is assumed. The checkpoint interval is given as a GridDB configuration value.

*   Checkpoint interval

The default value of the checkpoint interval is 1200 sec (20 minutes).

The transaction log file size is estimated as follows based on these numerical values:

File size = row data size * row update frequency * checkpoint interval (byte)

The individual disk usage is estimated as follows.

Individual disk usage = Transaction log file size + checkpoint file size 

**\[Point to note\]**

The size of the checkpoint file expands depending on the data capacity. However, please note that once it has expanded, the file size will not be reduced, even if some of data in the container or row gets deleted. Empty space can be re-used after data is deleted.
