using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PizzaBestilling.DAL;
using PizzaBestilling.Models;

namespace PizzaBestilling.Controllers
{
    [Route("[controller]/[action]")]
    public class OrderController : ControllerBase
    {

        private readonly IOrderRepository _orderDB;

        public OrderController(IOrderRepository orderDB)
        {
            _orderDB = orderDB;
        }

        [HttpPost]
        public async Task<bool> NewOrder([FromBody] Order newOrder)
        {
            return await _orderDB.NewOrder(newOrder);
        }

        public async Task<bool> RemoveOrder(int id)
        {
            return await _orderDB.RemoveOrder(id);
        }

        public async Task<List<Order>> GetAll()
        {
            return await _orderDB.GetAll();
        }
    }
}
