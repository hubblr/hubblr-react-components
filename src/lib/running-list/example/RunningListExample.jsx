import React from 'react';
import RunningList from '../components/RunningList';
import RunningListItem from '../components/RunningListItem';

function RunningListExample() {
  return (
    <RunningList className="z-10 w-full h-20 bg-black flex flex-row items-center mt-6">
      <RunningListItem>WELCOME</RunningListItem>
      <RunningListItem>+++ THIS IS A RUNNING TEXT</RunningListItem>
    </RunningList>
  );
}

export default RunningListExample;
