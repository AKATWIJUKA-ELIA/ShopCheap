"use client"
import React from 'react'
import Transactions from '@/components/TransactionsTable/Transactions'
import useGetTrasactionsByUser from '@/hooks/useGetTrasactionsByUser'

const Trasactions = () => {
        const { data } = useGetTrasactionsByUser();
  return (
    <div className='mt-[10%]' >
        <Transactions transactions={data ?? []} />
    </div>
  )
}

export default Trasactions