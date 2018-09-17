+++
title = "Run your First GridDB Node/Cluster"
weight = 3
+++


### Quickstart

We will be taking a quick look at running your first GridDB node/cluster. Please take a look at the example below.

### Start a Server

```
$ export GS_HOME=$PWD
$ export GS_LOG=$PWD/log
```

```
$ bin/gs_passwd admin
#input your_password
$ vi conf/gs_cluster.json
#"clusterName":"your\_clustername" #<-- input your\_clustername
$ export no_proxy=127.0.0.1
$ bin/gs_startnode
$ bin/gs\_joincluster -c your\_clustername -u admin/your_password
```