﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebStore.Infrastructure.Interfaces;
using WebStore.Models;

namespace WebStore.Infrastructure.Implementations
{
    public class InMemoryGoodsService : IGoodsService
    {
        private readonly List<GoodsView> _goods;
        public InMemoryGoodsService()
        {
            _goods = new List<GoodsView>
            {
                new GoodsView
                {
                    Id = 1,
                    Description = "Молоток",
                    EAN13 = "4602564782511",
                    Group = 100,
                    Price = 22.34F
                },
                new GoodsView
                {
                    Id = 2,
                    Description = "Дрель",
                    EAN13 = "4602564782619",
                    Group = 202,
                    Price = 100500.01F
                }
            };
        }

        public IEnumerable<GoodsView> GetAll()
        {
            return _goods;
        }

        public GoodsView GetById(int id)
        {
            return _goods.FirstOrDefault(e => e.Id.Equals(id));
        }

        public void Commit()
        {
            // ничего не делаем
        }

        public void AddNew(GoodsView model)
        {
            model.Id = _goods.Max(e => e.Id) + 1;
            _goods.Add(model);
        }

        public void Delete(int id)
        {
            var good = GetById(id);
            if (good != null)
            {
                _goods.Remove(good);
            }
        }
    }
}
