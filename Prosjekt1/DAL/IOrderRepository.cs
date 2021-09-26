using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cruisaholic.Models;

namespace Cruisaholic.DAL
{
    public interface IOrderRepository
    {
        [HttpPost]
        Task<int> NewOrder([FromBody] Order newOrder);
        Task<Order> GetOrderById(int id);
    }
}
