﻿using Core.Persistance.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Core.Persistance.Repositories;

public abstract class EfRepositoryBase<TEntity, TId, TContext> : IRepository<TEntity, TId>, IAsyncRepository<TEntity, TId>
    where TEntity : Entity<TId>
    where TContext : DbContext
{
    protected TContext Context { get; }
    protected EfRepositoryBase(TContext context)
    {
        Context = context;
    }

    
    public TEntity Add(TEntity entity)
    {
        entity.CreatedTime = DateTime.UtcNow;
        Context.Entry(entity).State = EntityState.Added;
        Context.SaveChanges();

        return entity;
    }

    public async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.CreatedTime = DateTime.UtcNow;
        Context.Entry(entity).State = EntityState.Added;

        await Context.SaveChangesAsync(cancellationToken);

        return entity;
    }

    public bool Any(Expression<Func<TEntity, bool>>? filter = null, bool enableTracking = true)
    {
        IQueryable<TEntity> query = Context.Set<TEntity>();

        if (enableTracking is false)
        {
            query = query.AsNoTracking();
        }
        if (filter is not null)
        {
            return query.Any(filter);
        }

        return query.Any();
    }

    public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>>? filter = null, bool enableTracking = true, CancellationToken cancellationToken = default)
    {
        IQueryable<TEntity> query = Context.Set<TEntity>();

        if (enableTracking is false)
        {
            query = query.AsNoTracking();
        }
        if (filter is not null)
        {
            return await query.AnyAsync(filter);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public TEntity Delete(TEntity entity)
    {
        Context.Entry(entity).State = EntityState.Deleted;
        Context.SaveChanges();

        return entity;
    }

    public async Task<TEntity> DeleteAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        Context.Entry(entity).State = EntityState.Deleted;
        await Context.SaveChangesAsync();

        return entity;
    }

    public TEntity? Get(Expression<Func<TEntity, bool>> filter, bool enableTracking = true, bool include = true)
    {
        IQueryable<TEntity> query = Context.Set<TEntity>();

        if (enableTracking is false)
        {
            query = query.AsNoTracking();
        }
        if (include is false)
        {
            query = query.IgnoreAutoIncludes();
        }

        return query.FirstOrDefault(filter);
    }

    public List<TEntity> GetAll(Expression<Func<TEntity, bool>>? filter = null, bool enableTracking = true, bool include = true)
    {
        IQueryable<TEntity> query = Context.Set<TEntity>();

        if (filter is not null)
        {
            query = query.Where(filter);
        }
        if (enableTracking is false)
        {
            query = query.AsNoTracking();
        }
        if (include is false)
        {
            query = query.IgnoreAutoIncludes();
        }

        return query.ToList();
    }

    public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? filter = null, bool enableTracking = true, bool include = true, CancellationToken cancellationToken = default)
    {
        IQueryable<TEntity> query = Context.Set<TEntity>();

        if (filter is not null)
        {
            query = query.Where(filter);
        }
        if (enableTracking is false)
        {
            query = query.AsNoTracking();
        }
        if (include is false)
        {
            query = query.IgnoreAutoIncludes();
        }

        return await query.ToListAsync(cancellationToken);
    }



    public async Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> filter, bool enableTracking = true, bool include = true, CancellationToken cancellationToken = default)
    {
        IQueryable<TEntity> query = Context.Set<TEntity>();

        if (enableTracking is false)
        {
            query = query.AsNoTracking();
        }
        if (include is false)
        {
            query = query.IgnoreAutoIncludes();
        }

        return await query.FirstOrDefaultAsync(filter, cancellationToken);
    }

    public TEntity Update(TEntity entity)
    {
        entity.UpdateTime = DateTime.UtcNow;
        Context.Entry(entity).State = EntityState.Modified;
        Context.SaveChanges();

        return entity;
    }

    public async Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.UpdateTime = DateTime.UtcNow;
        Context.Entry(entity).State = EntityState.Modified;
        await Context.SaveChangesAsync();

        return entity;
    }

    public async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
    {
        foreach (var entity in entities)
        {
            entity.CreatedTime = DateTime.UtcNow;
        }

        await Context.Set<TEntity>().AddRangeAsync(entities, cancellationToken);

        await Context.SaveChangesAsync();
    }

    
}
