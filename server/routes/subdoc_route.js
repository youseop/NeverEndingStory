const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
import { of, forkJoin, Observable } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";

const {GraphLookup, TestTree} = require("../models/Subdoc_test");

// mocked back-end response
const getFromServer = (managedData, id) => {
  return of(managedData[id]);
};

const getRecursive = (managedData, id) => {
  return getFromServer(managedData, id).pipe(
    map(data => ({
      parent: { 
        name: data.name, 
        sceneId: data.sceneId, 
        userId: data.userId, 
        id: data.id, 
        complaintCnt: data.complaintCnt, 
        children: []
      },
      childIds: data.children
    })),
    flatMap(parentWithChildIds =>
      forkJoin([
        of(parentWithChildIds.parent),
        ...parentWithChildIds.childIds.map(childId => getRecursive(managedData, childId))
      ])
    ),
    tap(
      ([parent, ...children]) => (parent.children = children)
    ),
    map(([parent]) => parent)
  );
};

function setTreeDate (user, sceneId) {
  return ({
    userId: user._id, 
    sceneId: sceneId, 
    name: "node",
    children: []
  })
}

router.post('/', async (req,res) => {
  try{
    const graphLookup = new GraphLookup(req.body);
    await graphLookup.save();
    return res.status(200).json({success: true});
  } catch (err) {
    return res.status(400).json({success: false});
  }
})


router.get('/', async (req,res) => {
  try{
    const result = await GraphLookup.aggregate([
      { $graphLookup: {
          from: "graphlookups",
          startWith: "$reportsTo",
          connectFromField: "reportsTo",
          connectToField: "name",
          as: "reportingHierarchy"
        }
      }
    ]).exec();

    console.log(result)


    return res.status(200).json({success: true, result});
  } catch (err) {
    return res.status(400).json({success: false});
  }
})

router.post('/treedata', async (req,res) => {
  const {userId, sceneId, prevSceneId} = req.body;
  try {
    const newTreeData = new TestTree(setTreeDate (userId, sceneId));
    await TestTree.updateOne(
      {sceneId: prevSceneId},
      {$push: {children: newTreeData._id.toString()}}
    );
    await newTreeData.save();
    return res.status(200).json({success: true, newTreeData});
  } catch (err) {
    return res.status(400).json({success: false});
  }
})

router.post('/game', async (req,res) => {
  try {
    const {gameId} = req.body;
    const firstSceneId = "606882da9be4ed39741bb03b";
    const data = {};

    const rawData = await TestTree.find({name: gameId});
    
    for (let i=0; i<rawData.length; i++){
      data = { ...data, [rawData[i]._id]: rawData[i]}
    }

    let tree;
    getRecursive(data, firstSceneId).subscribe(d=> { tree=d; })
    return res.status(200).json({success: true, tree});
  } catch (err) {
    return res.status(400).json({success: false});
  }
})



module.exports = router;