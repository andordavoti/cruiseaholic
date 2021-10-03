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
        Task<string> NewOrder([FromBody] CustomerOrder newOrder);
        Task<Customer> GetCustomerInfo(string email);
        Task<List<Route>> GetRoutes();
    }
}
