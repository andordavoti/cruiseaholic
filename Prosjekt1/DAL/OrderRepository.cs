using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruisaholic.Models;
using Microsoft.Extensions.Logging;

namespace Cruisaholic.DAL
{
    public class OrderRepository : IOrderRepository
    {

        private readonly OrderContext _orderDB;

        private ILogger<OrderRepository> _orderLog;

        public OrderRepository(OrderContext orderDB, ILogger<OrderRepository> orderLog)
        {
            _orderDB = orderDB;
            _orderLog = orderLog;

        }

        [HttpPost]
        public async Task<int> NewOrder([FromBody] Order newOrder)
        {
            try
            {
                _orderDB.Add(newOrder);
                await _orderDB.SaveChangesAsync();
                return newOrder.Id;
            }
            catch(Exception err)
            {
                _orderLog.LogInformation("New order failed with exception: " + err);
                return -1;
            }

        }


        public async Task<Order> GetOrderById(int id)
        {
            try
            {
                var order = await _orderDB.Orders.FindAsync(id);
                return order;
            }
            catch
            {
                return null;
            }
        }
    }
}

