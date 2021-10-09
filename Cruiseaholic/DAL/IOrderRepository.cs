using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cruiseaholic.Models;

namespace Cruiseaholic.DAL
{
    public interface IOrderRepository
    {
        [HttpPost]
        Task<string> NewOrder([FromBody] CustomerOrder newOrder);
        Task<Customer> GetCustomerInfo(string email);

        Task<List<Route>> GetRoutes();
        Task<List<Route>> AddRoute([FromBody] Route route);
        Task<List<Route>> ChangeRoute([FromBody] Route route);
        Task<List<Route>> RemoveRoute(int id);
        Task<bool> Login(User user);
    }
}
