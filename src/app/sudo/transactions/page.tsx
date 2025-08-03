"use client"
import React from 'react'
import Transactions from '@/components/TransactionsTable/Transactions'
import useGetAllTasactions from '@/hooks/useGetAllTasactions'

const Trasactions = () => {
        const { data } = useGetAllTasactions();
  return (
    <div>
        <Transactions transactions={data ?? []} />
    </div>
  )
}

export default Trasactions