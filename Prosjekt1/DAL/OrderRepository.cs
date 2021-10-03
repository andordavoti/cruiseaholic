using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruisaholic.Models;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
        public async Task<string> NewOrder([FromBody] CustomerOrder newOrder)
        {
            _orderLog.LogInformation("NewOrder: ");
            _orderLog.LogInformation(JsonConvert.SerializeObject(newOrder));

            Customer existingCustomer;

            try
            {
                existingCustomer = await _orderDB.Customer.SingleAsync(customer => customer.Email.Equals(newOrder.Email));
            }
            catch
            {
                existingCustomer = null;
            }

            _orderLog.LogInformation("ExistingCustomer: ");
            _orderLog.LogInformation(JsonConvert.SerializeObject(existingCustomer));

            var customer = new Customer();

            if (existingCustomer != null)
            {
                customer = existingCustomer;
                customer.FirstName = newOrder.FirstName;
                customer.LastName = newOrder.LastName;
                customer.PhoneNumber = newOrder.PhoneNumber;
            }
            else
            {
                customer.FirstName = newOrder.FirstName;
                customer.LastName = newOrder.LastName;
                customer.Email = newOrder.Email;
                customer.PhoneNumber = newOrder.PhoneNumber;
            }

            _orderLog.LogInformation("Customer: ");
            _orderLog.LogInformation(JsonConvert.SerializeObject(customer));

            var route = await _orderDB.Route.SingleAsync(route => route.ToDestination.Equals(newOrder.ToDestination) && route.FromDestination.Equals(newOrder.FromDestination));

            _orderLog.LogInformation("Route: ");
            _orderLog.LogInformation(JsonConvert.SerializeObject(route));

            var order = new Order()
            {
                NumberOfAdults = newOrder.NumberOfAdults,
                NumberOfChildren = newOrder.NumberOfChildren,
                NumberOfVehicles = newOrder.NumberOfVehicles,

                IsRoundtrip = newOrder.IsRoundtrip,
                DepartureDate = newOrder.DepartureDate,
                ArrivalDate = newOrder.ArrivalDate,

                CardNumber = newOrder.CardNumber,
                CardholderName = newOrder.CardholderName,
                CVC = newOrder.CVC,
                Expiry = newOrder.Expiry,

                Customer = customer,
                Route = route,
            };

            _orderLog.LogInformation("Order: ");
            _orderLog.LogInformation(JsonConvert.SerializeObject(order));

            _orderDB.Add(order);
            await _orderDB.SaveChangesAsync();
            return order.Customer.Email;
        }

        public async Task<Customer> GetCustomerInfo(string email)
        {
            try
            {
                var customerInfo = await _orderDB.Customer.SingleAsync(customer => customer.Email == email);
                return customerInfo;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Route>> GetRoutes()
        {
            try
            {
                var routes = await _orderDB.Route.ToListAsync();
                return routes;
            }
            catch
            {
                return null;
            }
        }
    }
}

