using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PizzaBestilling.Models;

namespace PizzaBestilling.DAL
{
    public interface IOrderRepository
    {
        [HttpPost]
        Task<bool> NewOrder([FromBody] Order newOrder);
        Task<bool> RemoveOrder(int id);
        Task<List<Order>> GetAll();
    }
}
